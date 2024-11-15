const models = require('../models');
const { Op } = require("sequelize");
const { logger } = require('../modules/logger');
const {
  getWalletInscriptions,
  getInscriptionsButch,
  getInscription,
  getInscriptionActivity
} = require('../services/bestinslotClient');

async function appendDbData( inscriptions ) {
  const inscriptionIds = inscriptions.map(i => i.inscription_id);
  const dbNfts = await models.nft.findAll({
    where: { inscriptionId: inscriptionIds, txId: { [Op.ne]: null } }
  });

  const nftsMap = dbNfts.reduce((map, nft) => {
    nft = nft.get();
    map.set(nft.inscriptionId, nft);
    return map;
  }, new Map());

  const dbListings = await models.listing.findAll({
    where: { inscriptionId: inscriptionIds }
  });

  const listingsMap = dbListings.reduce((map, listing) => {
    listing = listing.get();
    map.set(listing.inscriptionId, listing);
    return map;
  }, new Map());

  inscriptions = inscriptions.map(i => {
    if (nftsMap.has(i.inscription_id)) {
      const nft = nftsMap.get(i.inscription_id);
      i.migrated = true;
      i.inscription_name = nft.tokenName;
      i.collection_name = nft.collectionName;
      i.collection_address = nft.collectionAddress;
      i.token_id = nft.tokenId;
      i.chain_id = nft.chainId;
    } else {
      i.migrated = false;
      i.inscription_name = i.inscription_name || `Inscription #${i.inscription_number}`;
      i.collection_name = i.collection_name || `#${i.inscription_number}`;
    }

    if (listingsMap.has(i.inscription_id)) {
      const matchedListing = listingsMap.get(i.inscription_id);
      i.price = matchedListing.listingPrice;
      i.pending = matchedListing.status === 'pendingTransaction';
    }
    return i;
  });
  return inscriptions;
}

exports.getList = async (address, page) => {
  const result = await getWalletInscriptions(address, page);
  result.inscriptions = await appendDbData(result.inscriptions);
  return result;
};

exports.getListByIds = async ( inscriptionIds ) => {
  const rawInscriptions = await getInscriptionsButch( inscriptionIds );
  const inscriptions = rawInscriptions.map(ri => ri.result);
  return await appendDbData(inscriptions);
};

exports.getFullInscription = async ( inscriptionId ) => {
  let inscription = await getInscription(inscriptionId);
  let activity = [];
  if (inscription) {
    const inscriptionsList = await appendDbData([inscription]);
    inscription = inscriptionsList[0];
    try {
      activity = await getInscriptionActivity(inscriptionId);
    } catch(error) {
      logger.error(`Error message: " ${error} ". Unable to fetch Inscription activity`);
    }
  }

  return { inscription, activity };
};
