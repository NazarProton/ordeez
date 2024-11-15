const axios = require('axios');
const config = require('../config');

const nftScanHeaders = {
  'Content-Type': 'application/json',
  'X-API-KEY': config.nftScan.apiKey,
};

const nftScanSearchCollectionMetadata = async (ownerNftsValues) => {
  const chunkSize = 10;
  let chunkContractAddresses = [];
  let response = {};

  for(const ownerNft of ownerNftsValues) {
    if(ownerNft.exist) {
      continue;
    }

    const url = config.nftScan.searchContractMetadataUrl;

    if ((chunkContractAddresses.length === chunkSize || ownerNftsValues.size === chunkContractAddresses.length)) {
      if (chunkContractAddresses.length > 0) {
        response = await axios.post(url, {contract_address_list: chunkContractAddresses}, {
          headers: nftScanHeaders,
        });

        if (response.status !== 200) {
          throw new Error('Unable to fetch collection metadata');
        }

        chunkContractAddresses = [];
      }
    } else if (ownerNftsValues.size !== chunkContractAddresses.length) {
      chunkContractAddresses.push(ownerNft.contract.address);
    }
  }

  return response.data && response.data.data.length > 0 ? response.data.data.filter(item => !item.is_spam) : [];
};

module.exports = {
  nftScanSearchCollectionMetadata
};
