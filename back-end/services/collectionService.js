const models = require('../models');
const {QueryTypes, Op} = require("sequelize");
const _ = require('lodash');
const {
  getCollectionList,
  getCollectionInfo,
  getCollectionItems
} = require('../services/bestinslotClient');

const { getListByIds } = require('../services/inscriptionListService');

const ITEMS_PAGE_SIZE = 25;

exports.getList = async (params) => {
  const response = await getCollectionList(params);
  const items = response.items || [];

  const itemsMap = items.reduce((map, item, index) => {
    return map.set(item.slug || index.toString(), item);
  }, new Map());

  const slugs = Array.from(itemsMap.keys());
  const counts = await countsMapBySlugs(slugs);

  response.items = [];
  itemsMap.forEach((item, slug) => {
    item.listed_cnt_all = counts.has(slug) ? counts.get(slug) : 0;
    response.items.push(item);
  });

  const listingsCount = await models.listing.count( { where: {status: 'active'}} );
  response.volume.listings = listingsCount;
  return response;
};

exports.getInfo = async (slug) => {
  const response = await getCollectionInfo(slug);
  const listingsCount = await getListingsCountBySlug(slug);
  response.collection_info.listed_cnt_all = listingsCount;
  return response;
};

exports.getItems = async (slug, page) => {
  const result = await getCollectionItems(slug, page);
  if (result.items && result.items.length > 0) {
    const itemIds = result.items.map((item) => item.inscription_id);
    result.items = await getListByIds(itemIds);
  }
  return result;
};


exports.getListedItems = async (slug, page, sort, search) => {
  const order = [['status', 'DESC']];
  switch (sort) {
    case 'lowPrice':
      order.push(['listingPrice', 'ASC']);
      break;
    case 'highPrice':
      order.push(['listingPrice', 'DESC']);
      break;
    case 'recent':
      order.push(['id', 'DESC']);
      break;
    default:
      order.push(['listingPrice', 'ASC']);
  }

  const where = {
    collectionSlug: slug,
    status: ['active', 'pendingTransaction']
  };

  if (search) {
    where[Op.or] = [
      { collectionName: { [Op.like]: `%${search}%` } },
      { inscriptionName: { [Op.like]: `%${search}%` } }
    ];
  }

  const listedItems = await models.listing.findAll({
    where,
    order,
    limit: ITEMS_PAGE_SIZE + 1,
    offset: (page - 1) * ITEMS_PAGE_SIZE
  });

  const listedItemIds = listedItems.map((item) => item.get('inscriptionId'));
  const hasNext = listedItemIds.length >= ITEMS_PAGE_SIZE;
  const items = listedItemIds.length === 0 ? [] : await getListByIds(listedItemIds.slice(0, ITEMS_PAGE_SIZE));
  return { items, hasNext };
};

async function countsMapBySlugs(slugs) {
  const query = `select collectionSlug slug, count(*) cnt from listings where collectionSlug in (:slugs) and status = 'active' group by collectionSlug`;
  const result = await models.sequelize.query(
      query,
      {
        replacements: { slugs },
        type: QueryTypes.SELECT
      }
  );

  const resultMap = _.reduce(result, (map, cntEntity) => {
    return map.set(cntEntity.slug, cntEntity.cnt);
  }, new Map());

  return resultMap;
}

async function getListingsCountBySlug(slug) {
  return await models.listing.count( { where: [{status: ['active', 'pendingTransaction']}, {collectionSlug: slug}] } );
}
