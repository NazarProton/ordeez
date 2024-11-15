const config = {
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
  },
  db: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_TCP_PORT,
    dialect: 'mysql',
    pool: {
      max: 40,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  },
  nftImages: {
    fileSizeThreshold: 204800, //bytes
    imageWidthThreshold: 1024,
    gifWidthThreshold: 256,
    storeDownloadsPath: 'store/downloads',
    storeCompressesPath: 'store/compresses',
    quality: 80,
    qualityStep: 10,
    minQuality: 10,

  },
  unisat: {
    baseUrl: process.env.UNISAT_BASE_URL,
    apiKey: process.env.UNISAT_API_KEY,
    devAddress: process.env.UNISAT_DEV_ADDRESS,
    devFee: process.env.UNISAT_DEV_FEE,
  },
  alchemy: {
    apiKey: process.env.ALCHEMY_API_KEY || '',
  },
  nftScan: {
    apiKey: process.env.NFTSCAN_API_KEY || '',
    searchContractMetadataUrl: process.env.NFTSCAN_SEARCH_CONTRACT_METADATA_URL || '',
  },
  bestinslot: {
    baseUrl: process.env.BESTINSLOT_BASE_URL,
    apiKey: process.env.BESTINSLOT_API_KEY,
    pageSize: process.env.BESTINSLOT_PAGE_SIZE || 40
  },
  ordinalsbot: {
    baseUrl: process.env.ORDINALSBOT_BASE_URL,
    env: process.env.ORDINALSBOT_ENV,
    apiKey: process.env.ORDINALSBOT_API_KEY
  },
  tgBot: {
    channel: process.env.TG_BOT_CHANNEL,
    token: process.env.TG_BOT_TOKEN
  },
  web3Provider: process.env.WEB3_PROVIDER,
  ownerPrivateKey: process.env.OWNER_PRIVATE_KEY,
  cronIn15Seconds: '*/15 * * * * *', // runs per 15 seconds
  cronIn1Minute: '0 */1 * * * *', // runs per 1 minute
  cronIn5Minute: '0 */5 * * * *', // runs per 5 minute
  cronIn15Minute: '0 */15 * * * *', // runs per 15 minute

};

module.exports = config;
