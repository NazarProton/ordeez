const axios = require('axios');
const { logger } = require('../modules/logger');

// https://mempool.space/docs/api/rest#get-recommended-fees
exports.getFeesRecommended = async () => {
  const response = await axios.get(
    `https://mempool.space/api/v1/fees/recommended`
  );

  if (response.status !== 200) {
    const errorMessage = response.data.msg || 'Bad request';
    logger.error(`Mempool fetch fees error: ${errorMessage}`);
    throw new Error('Mempool fetch fees error');
  }

  return response.data;
};

exports.getTestnetFeesRecommended = async (ids) => {
  const response = await axios.get(
    `https://mempool.space/api/v1/fees/recommended`
  );

  if (response.status !== 200) {
    const errorMessage = response.data.msg || 'Bad request';
    logger.error(`Mempool fetch fees error: ${errorMessage}`);
    throw new Error('Mempool fetch fees error');
  }

  return response.data;
};
