const Web3 = require('web3');
const config = require('../../config');

const providerUrl = config.web3Provider;
const web3 = new Web3(providerUrl);

// const account = web3.eth.accounts.privateKeyToAccount(config.ownerPrivateKey);
// web3.eth.accounts.wallet.add(account);

module.exports = {
  Web3,
  providerUrl,
  web3
};
