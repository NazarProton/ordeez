const config = require('../config');
const axios = require('axios');
const {logger} = require('../modules/logger');
const options = {
    headers: { Authorization: `Bearer ${config.unisat.apiKey}` }
};

exports.createOrder = async (request) => {
    request.devAddress = config.unisat.devAddress;
    request.devFee = +config.unisat.devFee;
    request.outputValue = 546; // @todo clarify

    const response = await axios.post(
        `${config.unisat.baseUrl}/v2/inscribe/order/create`,
        request,
        options
    );

    if (response.status !== 200 || response.data.code === -1) {
        const errorMessage = response.data.msg || 'Bad request';
        logger.error(`UniSat create order error: ${errorMessage}`);
        throw new Error('Unable to create order');
    }

    return response.data.data;
};

exports.getOrder = async (orderId) => {
    const response = await axios.get(
        `${config.unisat.baseUrl}/v2/inscribe/order/${orderId}`,
        options
    );

    if (response.status !== 200 || response.data.code === -1) {
        const errorMessage = response.data.msg || 'Bad request';
        logger.error(`UniSat fetch order error: ${errorMessage}`);
        throw new Error('Unable to fetch order');
    }

    return response.data.data;
};

exports.indexerBalance = async (address) => {
    const response = await axios.get(
        `${config.unisat.baseUrl}/v1/indexer/address/${address}/balance`,
        options
    );

    if (response.status !== 200 || response.data.code === -1) {
        const errorMessage = response.data.msg || 'Bad request';
        logger.error(`UniSat get balance error: ${errorMessage}`);
        throw new Error('Unable to get balance');
    }

    return response.data.data;
};

exports.getUtxoInfo = async (txid, index) => {
    const response = await axios.get(
        `${config.unisat.baseUrl}/v1/indexer/utxo/${txid}/${index}`,
        options
    );

    if (response.status !== 200 || response.data.code === -1) {
        return null;
    }

    return response.data.data;
};
