const { alchemy } = require('../modules/alchemy');
const { nftScanSearchCollectionMetadata } = require('../modules/nftScan');
const models = require('../models');
// eslint-disable-next-line import/order
const { Op } = require('sequelize');
const { keccakHash } = require('../modules/utils');

exports.getList = async (ownerAddress, chainId, pageKey) => {
  const result = {
    pageKey,
    ownerNfts: [],
  };
  do {
    const pagedResult = await pagedList(ownerAddress, chainId, result.pageKey);
    result.pageKey = pagedResult.pageKey;
    result.ownerNfts = [...result.ownerNfts, ...pagedResult.ownerNfts];
  } while(result.ownerNfts.length < 30 && result.pageKey);

  return result;
};

async function pagedList(ownerAddress, chainId, pageKey) {
  const options = {
    spamConfidenceLevel: 'MEDIUM',
    tokenUriTimeoutInMs: 0,
    pageSize: 100,
    pageKey,
  };

  const alchemyResponse = await alchemy.nft.getNftsForOwner(
    ownerAddress,
    options
  );

  const ownerNfts = new Map();
  for(const ownerNft of alchemyResponse.ownedNfts) {
    if(
      ownerNft.image
        && ownerNft.image.cachedUrl
        && ownerNft.tokenType === 'ERC721'
        && ownerNft.image.contentType
        && ownerNft.image.size
        && (((ownerNft.image.contentType.includes('png')
                    || ownerNft.image.contentType.includes('jpeg')
                    || ownerNft.image.contentType.includes('webp')
                    || ownerNft.image.contentType.includes('svg'))
                && ownerNft.image.size < 30000000)
            || (ownerNft.image.contentType.includes('gif') && ownerNft.image.size < 10000000)
        )
    ) {
      ownerNfts.set(
        keccakHash(`${ownerNft.tokenId}${ownerNft.contract.address}${chainId}`),
        ownerNft
      );
    }
  }

  if(ownerNfts.size > 0) {
    const dbNfts = await models.nft.findAll({
      where: { hash: [...ownerNfts.keys()], txId: { [Op.ne]: null } },
    });
    for(const dbNft of dbNfts) {
      const hash = dbNft.get('hash');
      const ownerNft = ownerNfts.get(hash);
      ownerNft.exist = true;
      ownerNfts.set(hash, ownerNft);
    }
  }

  try {
    const collectionContactList = await nftScanSearchCollectionMetadata(ownerNfts.values());

    const filteredOwnerNftsAddresses = collectionContactList.map(filteredNft => filteredNft.contractAddress);

    for(const ownerNft of ownerNfts.values()) {
      if(!filteredOwnerNftsAddresses.includes(ownerNft.contract.address)) {
        ownerNfts.delete(ownerNft.hash);
      }
    }
  } catch(error) {
    throw new Error(`Error message: " ${error} ". Unable to fetch collection metadata`);
  }

  return {
    pageKey: alchemyResponse.pageKey,
    ownerNfts: [...ownerNfts.values()],
  };
}
