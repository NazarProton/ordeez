/* eslint-disable no-await-in-loop */
const { CronJob } = require('cron');
const config = require('../config');
const { logger } = require('../modules/logger');
const models = require('../models');
const { getOrder } = require('../services/unisatClient');

const LOGGER_PREFIX = '[CRON][ORDER]';
let passed = true;

const ORDER_COMPLETE_STATUSES = [
  'closed', // delete inscriptions
  'cancel', // check inscription status
  'minted',
  'refunded' // check inscription status
];

function isOrderComplete(order) {
  return ORDER_COMPLETE_STATUSES.indexOf(order.status) >= 0;
}

async function onProcess() {
  passed = false;
  await logger.info(`${LOGGER_PREFIX} triggered`);

  const nfts = await models.nft.findAll({ where: { orderComplete: false } });

  const nftsMap = nfts.reduce((map, nft) => {
    const orderMap = map.get(nft.orderId) || new Map();
    orderMap.set(nft.filename, nft);
    map.set(nft.orderId, orderMap);
    return map;
  }, new Map());

  const orderIds = nftsMap.keys();
  for(const orderId of orderIds) {
    try {
      const order = await getOrder(orderId);
      if(!order) {
        logger.warn(`Order ${orderId} not found on unisat`);
        continue;
      }
      // https://docs.unisat.io/dev/unisat-developer-service/unisat-inscribe/search-order
      const orderMap = nftsMap.get(orderId);
      for(const orderFile of order.files) {
        if(orderMap.has(orderFile.filename)) {
          const nft = orderMap.get(orderFile.filename);
          nft.set('inscriptionId', orderFile.inscriptionId);
          nft.set('inscriptionStatus', orderFile.status);
          nft.set('orderStatus', order.status);
          nft.set('orderComplete', isOrderComplete(order));
          await nft.save();
        }
      }
    } catch(err) {
      logger.error(`Error processing order: ${orderId}. ${err}`);
    }
  }

  passed = true;
}

function onTick() {
  if(passed) {
    onProcess();
  }
}

module.exports = function() {
  logger.info(`${LOGGER_PREFIX} started ...`);
  const job = new CronJob(config.cronIn1Minute, onTick); // running per 15 secs
  job.start();
};
