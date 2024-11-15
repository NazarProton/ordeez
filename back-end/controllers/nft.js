/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const fs = require('fs-extra');
const md5 = require('md5');
const createKeccakHash = require('keccak');
const { QueryTypes, Op } = require('sequelize');
const https = require('https');
const sharp = require('sharp');
const config = require('../config');
const _ = require('lodash');
const models = require('../models');
const { errorResponse, reducedErrorMessage } = require('../modules/utils');
const { make } = require('simple-body-validator');
const { logger } = require('../modules/logger');
const { createOrder, indexerBalance } = require('../services/unisatClient');
const {
  getFeesRecommended,
  getTestnetFeesRecommended,
} = require('../services/mempoolClient');
const { getList: getAlchemyNftList } = require('../services/nftListService');
const {
  getList: getInscriptionsList,
} = require('../services/inscriptionListService');

exports.getNft = async (req, res) => {
  // eslint-disable-line
  try {
    const { hash } = req.params;
    const nft = await models.nft.findAll({ where: { hash } });
    const nftData = nft.map((o) =>
      _.omit(o.get(), ['id', 'createdAt', 'updatedAt'])
    );
    return res.status(200).json({
      success: true,
      data: nftData,
    });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.getMigratorNft = async (req, res) => {
  // eslint-disable-line
  try {
    const { migrator } = req.params;
    const nft = await models.nft.findAll({ where: { migrator } });
    const nftData = nft.map((o) =>
      _.omit(o.get(), ['id', 'createdAt', 'updatedAt'])
    );
    return res.status(200).json({
      success: true,
      data: nftData,
    });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.addNft = async (req, res) => {
  try {
    const rules = {
      hash: ['required', 'string'],
      chainId: ['required', 'numeric'],
      collectionAddress: ['required', 'string'],
      tokenId: ['required', 'string'],
      collectionName: ['required', 'string'],
      tokenName: ['required', 'string'],
      ordinalNumber: ['required', 'string'],
    };
    const validator = make().setData(req.body).setRules(rules);
    if (!validator.validate()) {
      return res
        .status(400)
        .json({ status: false, errors: validator.errors().all() });
    }
    await models.nft.create(req.body);
    return res.status(200).json({ status: true });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.searchNft = async (req, res) => {
  try {
    const rules = {
      hashes: ['required', 'array'],
    };
    const validator = make().setData(req.body).setRules(rules);
    // @todo validate max length, of strings
    const validationResult = await validator.validateAsync();
    if (!validationResult) {
      return res
        .status(400)
        .json({ status: false, errors: validator.errors().all() });
    }
    const nft = await models.nft.findAll({ where: { hash: req.body.hashes } });
    const nftData = nft.map((o) => o.get('hash'));
    return res.status(200).json({
      success: true,
      data: nftData,
    });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};

async function downloadFile(url) {
  const filename = md5(url);
  const dFilename = `${config.nftImages.storeDownloadsPath}/${filename}`;
  const cFilename = `${config.nftImages.storeCompressesPath}/${filename}`;
  let promise = new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(dFilename);
      res.pipe(fileStream);

      fileStream.on('finish', async () => {
        fileStream.close();
        const sh = sharp(dFilename, { animated: true });
        const fileMeta = await sh.metadata();
        const ext = fileMeta.format;
        let fileInfo;

        await sh
          .toBuffer({ resolveWithObject: true })
          .then(({ data, info }) => {
            fileInfo = info;
          });

        if (+fileInfo.size > config.nftImages.fileSizeThreshold) {
          const width = Math.min(
            +config.nftImages.imageWidthThreshold,
            +fileInfo.width
          );
          await sh
            .webp({ quality: 40 })
            .resize({ width: 256 })
            .toFile(`${cFilename}.webp`)
            .then((value) => {
              console.log(`Compressed ${cFilename}.${ext} successfully`);
              value = _.omit(value.data, ['channels', 'premultiplied']);
              value.imageUrl = url;
              resolve(value);
            });
        } else {
          fileInfo = _.omit(fileInfo, ['channels', 'premultiplied']);
          resolve(fileInfo);
        }
        console.log('Download finished');
      });
    });
  });

  return await promise;
}

exports.estimateNft = async (req, res) => {
  const rules = {
    imageUrls: ['required', 'array'],
  };
  const validator = make().setData(req.body).setRules(rules);
  // @todo validate max length, of strings
  const validationResult = await validator.validateAsync();
  if (!validationResult) {
    return res
      .status(400)
      .json({ status: false, errors: validator.errors().all() });
  }

  const imageUrls = req.body.imageUrls;
  let responseData = {
    contentTypeSize: 0,
    totalSize: 0,
    itemsData: [],
  };

  try {
    for (const imageUrl of imageUrls) {
      let result = await consumeImageUrlToData(imageUrl);
      result.dataURL = 'data:image/webp;base64,' + result.base64;
      responseData.contentTypeSize =
        responseData.contentTypeSize +
        result.dataURL.split('data:')[1].split('base64')[0].length;
      responseData.totalSize = responseData.totalSize + result.size;
      result = _.omit(result, ['base64', 'filename', 'dataURL']);
      responseData.itemsData.push(result);
    }
  } catch (err) {
    logger.error(err);
    return errorResponse(res, reducedErrorMessage(err));
  }

  return res.status(200).json({
    success: true,
    data: responseData,
  });
};

async function validateOrderRequestBody(body) {
  const rules = {
    receiveAddress: ['required', 'string'],
    feeRate: ['required', 'integer'],
    migrator: ['required', 'string'],
    nfts: ['required', 'array'],
  };

  const nftRules = {
    chainId: ['required', 'numeric'],
    collectionAddress: ['required', 'string'],
    collectionName: ['required', 'string'],
    tokenId: ['required', 'string'],
    tokenName: ['required', 'string'],
    imageUrl: ['required', 'url'],
  };
  const validator = await make().setData(body).setRules(rules);
  const validationResult = await validator.validateAsync();
  if (!validationResult) {
    return validator.errors().all();
  }

  const nfts = body.nfts;
  const hashes = nfts.map(nftHash);
  const hashesValidator = await make()
    .setData({ hashes: hashes })
    .setRules({ hashes: 'array_unique' });
  const hashesValidationResult = await hashesValidator.validateAsync();
  if (!hashesValidationResult) {
    return hashesValidator.errors().all();
  }

  const existEntities = await models.nft.findAll({
    where: { hash: hashes, txId: { [Op.ne]: null } },
  });
  if (existEntities.length > 0) {
    return _.chain(existEntities)
      .mapValues((v) => v.get())
      .keyBy('hash')
      .mapValues((v) => `Already migrated`);
  }

  const errors = new Map();
  for (const nft of nfts) {
    const validator = await make().setData(nft).setRules(nftRules);
    const validationResult = await validator.validateAsync();
    if (!validationResult) {
      errors.set(nft.hash, validator.errors().all());
    }
  }
  if (errors.size > 0) {
    return Object.fromEntries(errors);
  }
}

async function consumeImageUrlToData(url) {
  const filename = md5(url);
  const dFilename = `${config.nftImages.storeDownloadsPath}/${filename}`;
  let promise = new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(dFilename);
      res.pipe(fileStream);

      fileStream.on('finish', async () => {
        fileStream.close();
        const sh = sharp(dFilename, { animated: true });
        let quality = config.nftImages.quality;
        let fileInfo;
        let fileData;

        await sh
          .toBuffer({ resolveWithObject: true })
          .then(({ data, info }) => {
            fileInfo = info;
            fileData = data;
          });

        const ext = fileInfo.format;
        const widthThreshold = ext.includes('gif')
          ? +config.nftImages.gifWidthThreshold
          : +config.nftImages.imageWidthThreshold;
        const width = Math.min(widthThreshold, +fileInfo.width);

        while (
          fileInfo.size >= config.nftImages.fileSizeThreshold &&
          quality >= config.nftImages.minQuality
        ) {
          await sh
            .webp({ quality: quality })
            .resize({ width })
            .toBuffer({ resolveWithObject: true })
            .then(({ data, info }) => {
              fileInfo = info;
              fileData = data;
            });
          quality = quality - config.nftImages.qualityStep;
        }

        const result = _.omit(fileInfo, ['channels', 'premultiplied']);
        result.base64 = fileData.toString('base64');
        result.imageUrl = url;
        result.filename = `${filename}.webp`;
        resolve(result);
        console.log('Download finished');
      });
    });
  });

  return await promise;
}

function nftHash(nft) {
  return (
    '0x' +
    createKeccakHash('keccak256')
      .update(nft.tokenId + nft.collectionAddress + nft.chainId)
      .digest('hex')
  );
}

exports.createOrder = async (req, res) => {
  const requestBody = req.body;
  const errors = await validateOrderRequestBody(requestBody);
  if (errors) {
    return res.status(400).json({ status: false, errors });
  }

  const nftEntities = [];
  const unisatRequest = {
    receiveAddress: requestBody.receiveAddress,
    feeRate: +requestBody.feeRate,
    files: [],
  };

  for (const nft of requestBody.nfts) {
    const imageData = await consumeImageUrlToData(nft.imageUrl);
    unisatRequest.files.push({
      filename: imageData.filename,
      dataURL: 'data:image/webp;base64,' + imageData.base64,
    });
    nft.hash = nftHash(nft);
    nft.filename = imageData.filename;
    nft.migrator = requestBody.migrator;
    const nftEntity = await models.nft.build(nft);
    nftEntities.push(nftEntity);
  }

  const orderResponse = await createOrder(unisatRequest);

  for (const nftEntity of nftEntities) {
    nftEntity.orderId = orderResponse.orderId;
    nftEntity.orderStatus = orderResponse.status;
    await nftEntity.save();
  }

  return res.status(200).json({
    success: true,
    data: {
      payAddress: orderResponse.payAddress,
      amount: orderResponse.amount,
      orderId: orderResponse.orderId,
    },
  });
};

exports.getMigratorOrders = async (req, res) => {
  const pageSize = 20;
  const { migrator, page } = req.params;
  const query =
    'select orderId, max(orderStatus) status, count(*) quantity, max(createdAt) date, max(txId) txId ' +
    "from nfts where migrator = :migrator and orderStatus in ('pending','minted','cancel','ready','inscribing','refunded') and txId is not null " +
    'group by orderId order by date desc limit :offset,:limit';
  let [orders] = await models.sequelize.query(
    query,
    {
      replacements: { migrator, offset: +page * pageSize, limit: pageSize + 1 },
    },
    { type: QueryTypes.SELECT }
  );
  orders = orders.map((o) => {
    switch (o.status) {
      case 'minted':
        o.status = 'Confirmed';
        break;
      case 'cancel':
        o.status = 'Canceled';
        break;
      default:
        o.status = _.capitalize(o.status);
        break;
    }
    return o;
  });
  return res.status(200).json({
    success: true,
    data: {
      orders: orders.slice(0, pageSize),
      hasNext: orders.length > pageSize,
    },
  });
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { txId } = req.body;
    await models.nft.update({ txId }, { where: { orderId } });
    return res.status(200).json({ success: true });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.getIndexerBalance = async (req, res) => {
  try {
    const { address } = req.params;
    const balanceResponse = await indexerBalance(address);
    return res.status(200).json({ success: true, data: balanceResponse });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.getMigratorInscriptions = async (req, res) => {
  try {
    const { migratorAddress, page } = req.params;
    const result = await getInscriptionsList(migratorAddress, page);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.listNft = async (req, res) => {
  try {
    const { ownerAddress, chainId, pageKey } = req.params;
    const result = await getAlchemyNftList(ownerAddress, chainId, pageKey);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.getFeesRecommended = async (req, res) => {
  // eslint-disable-line
  try {
    return res.status(200).json({
      success: true,
      data: await getFeesRecommended(),
    });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.getTestnetFeesRecommended = async (req, res) => {
  // eslint-disable-line
  try {
    return res.status(200).json({
      success: true,
      data: await getTestnetFeesRecommended(),
    });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};
