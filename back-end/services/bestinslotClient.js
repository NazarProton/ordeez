const config = require('../config');
const axios = require('axios');
const { logger } = require('../modules/logger');
const options = {
    headers: { "x-api-key": config.bestinslot.apiKey }
};

const BESTINSLOT_V2_URL = 'https://v2api.bestinslot.xyz';

// https://docs.bestinslot.xyz/reference/api-reference/ordinals-and-brc-20-and-bitmap-v3-api-mainnet+testnet/wallets#get-wallet-inscriptions-1
exports.getWalletInscriptions = async (address, page) => {
    const pageSize = +config.bestinslot.pageSize;
    page = +page >= 0 ? +page : 0;
    options.params = {
        sort_by: 'inscr_num',
        order: 'desc',
        offset: page * pageSize,
        count: pageSize * 2,
        address: address,
        exclude_brc20: true
        // cursed_only: false
    };

    const response = await axios.get(
        `${config.bestinslot.baseUrl}/wallet/inscriptions`,
        options
    );

    if (response.status !== 200 || response.data.code === -1) {
        const errorMessage = response.data.msg || 'Bad request';
        logger.error(`Bestinslot fetch order error: ${errorMessage}`);
        throw new Error('Bestinslot to fetch order');
    }

    return {
        inscriptions: response.data.data.slice(0, pageSize),
        hasNext: response.data.data.length > pageSize
    };
};

exports.getInscriptionsButch = async ( ids ) => {
    const request = {
        queries: ids
    };
    const response = await axios.post(
        `${config.bestinslot.baseUrl}/inscription/batch_info`,
        request,
        options
    );

    if (response.status !== 200 || response.data.code === -1) {
        const errorMessage = response.data.msg || 'Bad request';
        logger.error(`Bestinslot fetch batch error: ${errorMessage}`);
        throw new Error('Bestinslot unable to fetch batch of inscriptions');
    }

    return response.data.data;
};

exports.getInscription = async ( id ) => {
    options.params = {
        inscription_id: id
    };
    const response = await axios.get(
        `${config.bestinslot.baseUrl}/inscription/single_info_id`,
        options
    );

    if (response.status !== 200 || response.data.data === 'no-data') {
        const errorMessage = response.data.msg || 'Bad request';
        logger.error(`Bestinslot fetch error: ${errorMessage}`);
        throw new Error('Bestinslot unable to fetch inscriptions');
    }

    return response.data.data;
};

exports.getInscriptionActivity = async ( id ) => {
    options.params = {
        inscription_id: id,
        activity_filter: 7,
        sort_by: 'ts',
        order: 'desc',
        offset: 0,
        count: 100,

    };
    const response = await axios.get(
        `${config.bestinslot.baseUrl}/inscription/activity`,
        options
    );

    if (response.status !== 200 || response.data.data === 'no-data') {
        const errorMessage = response.data.msg || 'Bad request';
        logger.error(`Bestinslot fetch error: ${errorMessage}`);
        throw new Error('Bestinslot unable to fetch inscriptions');
    }

    return response.data.data;
};

exports.getCollectionList = async ( params ) => {

    const response = await axios.get(
        `${BESTINSLOT_V2_URL}/collection/all`,
        { params }
    );

    if (response.status !== 200) {
        const errorMessage = response.data.msg || 'Bad request';
        logger.error(`Bestinslot fetch error: ${errorMessage}`);
        throw new Error('Bestinslot unable to fetch collections');
    }

    return response.data;
};

exports.getCollectionInfo = async ( slug ) => {

    const response = await axios.get(
        `${BESTINSLOT_V2_URL}/collection/info`,
        { params: { slug } }
    );

    if (response.status !== 200) {
        const errorMessage = response.data.msg || 'Bad request';
        logger.error(`Bestinslot fetch error: ${errorMessage}`);
        throw new Error('Bestinslot unable to fetch collection info');
    }

    return response.data;
};

exports.getCollectionItems = async ( slug, page, sort ) => {
    const params = { slug, page };
    if (sort) {
        params.sort = sort;
    }

    const response = await axios.get(
        `${BESTINSLOT_V2_URL}/collection/items`,
        { params }
    );

    if (response.status !== 200) {
        const errorMessage = response.data.msg || 'Bad request';
        logger.error(`Bestinslot fetch error: ${errorMessage}`);
        throw new Error('Bestinslot unable to fetch collection items');
    }

    return {
        items: response.data.items,
        hasNext: response.data.items.length >= response.data.per_page //@todo implement hasNext
    };
};
