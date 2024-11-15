const monitorRouter = require('./monitor');
const nftController = require('../controllers/nft');
const activityController = require('../controllers/activity');
const marketplaceController = require('../controllers/marketplace');
const inscriptionController = require('../controllers/inscription');
const collectionController = require('../controllers/collection');

module.exports = function(app) {
  app.get('/api/nft/:hash', nftController.getNft);
  app.get('/api/nft/migrator/:migrator', nftController.getMigratorNft);
  app.post('/api/nft/', nftController.addNft);
  app.post('/api/nft/search', nftController.searchNft);
  app.post('/api/nft/estimate', nftController.estimateNft);
  app.post('/api/nft/order', nftController.createOrder);
  app.patch('/api/nft/order/:orderId', nftController.updateOrder);
  app.get('/api/nft/list/:chainId/:ownerAddress/:pageKey', nftController.listNft);
  app.get('/api/orders/:migrator/:page', nftController.getMigratorOrders);
  app.get('/api/indexer/:address/balance', nftController.getIndexerBalance);
  app.get('/api/inscriptions/:migratorAddress/:page', nftController.getMigratorInscriptions);
  app.get('/api/inscriptions/:id', inscriptionController.getInscription);

  app.get('/api/collections', collectionController.getCollectionsList);
  app.get('/api/collection/listed-items', collectionController.getCollectionListedItems);
  app.get('/api/collection/items', collectionController.getCollectionItems);
  app.get('/api/collection/:slug', collectionController.getCollectionInfo);

  app.get('/api/marketplace/listings', marketplaceController.listListings);
  app.get('/api/marketplace/:page', marketplaceController.listOrdinals);
  app.post('/api/marketplace/list-for-sale', marketplaceController.listOrdinalsForSale);
  app.post('/api/marketplace/save-listing', marketplaceController.saveListing);
  app.post('/api/marketplace/update-listing', marketplaceController.updateListing);
  app.post('/api/marketplace/confirm-update-listing', marketplaceController.confirmUpdateListing);
  app.post('/api/marketplace/delete-listing', marketplaceController.deleteListing);
  app.post('/api/marketplace/confirm-delete-listing', marketplaceController.confirmDeleteListing);
  app.post('/api/marketplace/create-buy-offer', marketplaceController.createBuyOffer);
  app.post('/api/marketplace/submit-buy-offer', marketplaceController.submitBuyOffer);
  app.post('/api/marketplace/revert-pending-status', marketplaceController.revertPendingStatus);
  app.post('/api/marketplace/dummy-utxos-psbt', marketplaceController.getDummyUtxosPsbt);
  app.post('/api/marketplace/broadcast-psbt', marketplaceController.broadcastPsbt);

  app.get('/api/activity', activityController.getActivity);
  app.get('/api/latest/migrations', activityController.getLatestMigrations);
  app.get('/api/latest/listings', activityController.getLatestListings);
  app.get('/api/latest/sales', activityController.getLatestSales);

  app.get('/api/fees/recommended', nftController.getFeesRecommended);
  app.get('/api/testnet/fees/recommended', nftController.getTestnetFeesRecommended);

  // deprecated
  app.use('/api/v1/monitor', monitorRouter);
};
