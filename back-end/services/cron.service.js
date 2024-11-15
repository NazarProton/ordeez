
const cronOrder = require('./cron.order');
const cronActivity = require('./cron.activity');
const cronBuyTransaction = require('./cron.buyTransaction');
const cronListingCleanup = require('./cron.listingCleanup');

module.exports = function() {
  cronOrder();
  cronActivity();
  cronBuyTransaction();
  cronListingCleanup();
};
