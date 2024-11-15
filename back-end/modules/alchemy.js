const config = require('../config');
const { Network, Alchemy } = require('alchemy-sdk');

const alchemy = new Alchemy({
    apiKey: config.alchemy.apiKey,
    network: Network.ETH_MAINNET
});

module.exports = {
    alchemy
};
