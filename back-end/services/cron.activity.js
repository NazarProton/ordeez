/* eslint-disable no-await-in-loop */
const { CronJob } = require('cron');
const config = require('../config');
const { logger } = require('../modules/logger');
const models = require('../models');
const {getListByIds} = require("./inscriptionListService");

const LOGGER_PREFIX = '[CRON][ACTIVITY]';
const LAST_ACTIVITY_SIZE = 4;
const CATEGORY_SOLD = 'sold';
const CATEGORY_LISTED = 'listed';
const STATUS_ENUM = Object.freeze({
  'sold': 'sold',
  'listed': 'active'
});

let passed = true;

async function upsertActivity(category = CATEGORY_LISTED) {

  const listings = await models.listing.findAll({
    where: { status: STATUS_ENUM[category] },
    limit: LAST_ACTIVITY_SIZE,
    order: [['updatedAt', 'DESC']]
  });

  if (listings.length === 0) {
    return;
  }

  const inscriptionIds = listings.map((l) => { return l.get('inscriptionId'); });
  const inscriptions = await getListByIds(inscriptionIds);

  models.mpActivity.destroy({
    where: { category }
  });

  for (const i of inscriptions) {
    await models.mpActivity.create({
      migrated: i.migrated,
      inscriptionName: i.inscription_name,
      collectionName: i.collection_name,
      contentUrl: i.content_url,
      price: i.price,
      category
    });
  }
}

async function onProcess() {
  passed = false;
  await logger.info(`${LOGGER_PREFIX} triggered`);

  try {
    await upsertActivity(CATEGORY_LISTED);
    await upsertActivity(CATEGORY_SOLD);
  } catch (err) {
    passed = true;
    logger.error(`${LOGGER_PREFIX} Error processing activity: ${err}`);
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
  const job = new CronJob(config.cronIn15Minute, onTick); // running per 15 secs
  job.start();
};
