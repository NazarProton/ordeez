/* eslint-disable no-await-in-loop */
const { CronJob } = require('cron');
const { logger } = require('../modules/logger');
const config = require('../config');
const models = require('../models');
const { getTxStatus } = require("./psbtService");
const TxStatus = require('../enums/txStatus');

const LOGGER_PREFIX = '[CRON][BUY_TRANSACTION]';
let passed = true;

async function onProcess() {
  passed = false;
  await logger.info(`${LOGGER_PREFIX} triggered`);

  const pendingTxListings = await models.listing.findAll({ where: { status: 'pendingTransaction' } });
  for (const listing of pendingTxListings) {
    try {
      if (!listing.broadcastTxId) {
        await logger.warn(`${LOGGER_PREFIX} Broadcast Tx not found for listing in 'pendingTransaction': ${listing.inscriptionId}`);
        continue;
      }

      const status = await getTxStatus(listing.broadcastTxId);
      switch (status) {
        case TxStatus.PENDING:
          console.log(`Transaction ${listing.broadcastTxId} is pending. Please wait for confirmation.`);
          // Additional actions for pending status
          break;

        case TxStatus.FAILED:
          listing.set('status', 'active');
          listing.set('signedBuyerPSBT', null);
          listing.set('broadcastTxId', null);
          await listing.save();
          break;

        case TxStatus.CONFIRMED:
          await models.listing.destroy({where: {inscriptionId: listing.inscriptionId}});
          break;

        default:
          console.log('Unknown transaction status:', status);
      }

    } catch (err) {
      await logger.error(`${LOGGER_PREFIX} Error processing order: ${listing.inscriptionId}. ${err}`);
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
  const job = new CronJob(config.cronIn5Minute, onTick); // running per 15 secs
  job.start();
};
