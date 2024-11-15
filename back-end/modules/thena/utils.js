const BigNumber = require('bignumber.js');
const { web3 } = require('./web3');
const { logger } = require('../logger');
const { sleep } = require('../utils');

const createEthAccount = () => web3.eth.accounts.create();

const getBalance = async (address) => {
  const ethBalance = await web3.eth.getBalance(address);
  return ethBalance;
};

const checkBalance = async (address, threshold = 0) => {
  const balance = await getBalance(address);
  if(balance <= threshold) {
    throw new Error('Insufficient balance');
  }
  return balance;
};

const callMethod = async (method, args = []) => {
  const result = await method(...args).call();
  return result;
};

const sendTransaction = async (toAddress, privateKey, contractMethod, args = []) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  // const accountNonce = web3.eth.getTransactionCount(account.address);
  // await checkBalance(account.address);
  const encodedABI = contractMethod(...args).encodeABI();
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).times(1.5).dp(0, 2).toNumber();
  const tx = {
    from: account.address,
    to: toAddress,
    gas: 700 * 10000,
    // gasPrice: 30 * 1e9,
    gasPrice: `0x${gasPrice.toString(16)}`,
    data: encodedABI,
    value: '0x0',
    // nonce: accountNonce,
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  const result = await new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .on('error', async (err) => {
        // console.log('reject err : ', err);
        await logger.info(`[TRANSACTION][ERROR]: ${err}`);
        return reject(err);
      })
      .on('transactionHash', (hash) => {
        // console.log('created transaction hash : ', hash);
        // return resolve(hash);
      })
      .on('receipt', (result2) => {
        // console.log('receipt : ', result2);
        return resolve(result2);
      });
  });

  return result;
};

const sendTransactionWithReceipt = async (contractMethod, args) => {
  const gasAmount = await contractMethod(...args).estimateGas({ from: account.address });
  const gasPrice = await web3.eth.getGasPrice();
  const res = await contractMethod(...args).send({
    gas: gasAmount,
    from: account.address,
    gasPrice: gasPrice
  });

  // sleep is mandatory since accountNonce does not get updated for frequent transactions broadcasting
  // Error: Returned error: nonce too low
  // logger.info("accountNonce " + accountNonce);
  await sleep(1);
  return await web3.eth.getTransactionReceipt(res.transactionHash);
};

module.exports = {
  createEthAccount,
  getBalance,
  checkBalance,
  callMethod,
  sendTransaction,
  sendTransactionWithReceipt
};
