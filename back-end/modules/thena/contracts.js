/* eslint-disable quote-props */
/* eslint-disable max-len */
const { web3 } = require('./web3');
const multicallAbi = require('./abis/multiCall.json');
const config = require('../../config');

const { multicallAddress } = config.contracts;
const multicallContract = new web3.eth.Contract(multicallAbi, multicallAddress);

module.exports = {
  multicallContract
};
