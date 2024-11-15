/* eslint-disable no-await-in-loop */
const { CronJob } = require('cron');
const { Op } = require("sequelize");
const config = require('../config');
const { logger } = require('../modules/logger');
const models = require('../models');
const LOGGER_PREFIX = '[CRON][LISTING_CLEANUP]';
const DIFF = 60; //seconds

let passed = true;

async function cleanup() {

  const listings = await models.listing.findAll({
    where: {
      status: 'pendingSeller',
      updatedAt: { [Op.lt]: new Date(new Date() - DIFF * 1000)}
    }
  });

  if (listings.length === 0) {
    return;
  }

  for (const listing of listings) {
    await listing.destroy();
  }
}

async function onProcess() {
  passed = false;
  await logger.info(`${LOGGER_PREFIX} triggered`);

  try {
    await cleanup();
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
  const job = new CronJob(config.cronIn1Minute, onTick); // running per 15 secs
  job.start();
};
