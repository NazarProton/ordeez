const {logger} = require('../modules/logger');
const {getInscription} = require('../services/bestinslotClient');
const models = require('../models');
const {getListByIds} = require('./inscriptionListService');
const {
    getInitPsbt,
    getBuyPsbt,
    generateDummyUtxosPsbt,
    broadcastPurchase,
    getOutputAddressFromPsbt,
    broadcastSignedPsbt,
    getDummyUtxos
} = require('../services/psbtService');
const {Op} = require("sequelize");
const {verifySellerSignedPsbt} = require("./psbtService");

const LOGGER_PREFIX = '[SERVICE][MARKETPLACE]';
const LISTING_PAGE_SIZE = 40;
const DELIST_PRICE = 1990000000000000;

const LISTING_STATUS = Object.freeze({
    sold: Symbol('Sold'),
    active: Symbol('Active'),
    inactive: Symbol('Inactive'),
    pendingBuyer: Symbol('Pending Buyer Confirmation'),
    pendingSeller: Symbol('Pending Seller Confirmation'),
    pendingTransaction: Symbol('Pending Broadcasting Transaction'),
});

async function findActivityByCategory(category) {
    const listings = await models.mpActivity.findAll({
        where: {'category': category}
    });

    return listings.map((l) => {
        const lObject = l.get();
        return {
            inscription_name: lObject.inscriptionName,
            collection_name: lObject.collectionName,
            migrated: lObject.migrated,
            content_url: lObject.contentUrl,
            price: lObject.price
        };
    });
}

exports.getLastListed = async () => {
    return await findActivityByCategory('listed');
};

exports.getLastSold = async () => {
    return await findActivityByCategory('sold');
};

exports.getList = async (page, slug, sort, search) => {

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
            order.push(['id', 'DESC']);
    }

    const where = {
        status: ['active', 'pendingTransaction']
    };

    if (slug) {
        where.collectionSlug = slug;
    }

    if (search) {
        where[Op.or] = [
            { collectionName: { [Op.like]: `%${search}%` } },
            { inscriptionName: { [Op.like]: `%${search}%` } }
        ];
    }

    const listings = await models.listing.findAll({
        where,
        order,
        offset: +page * LISTING_PAGE_SIZE,
        limit: LISTING_PAGE_SIZE + 1
    });

    if (listings.length === 0) {
        return {
            inscriptions: [],
            hasNext: false
        };
    }
    const ordinalId = listings.map(l => l.get('inscriptionId'));
    const inscriptions = await getListByIds(ordinalId.slice(0, LISTING_PAGE_SIZE));
    return {
        inscriptions,
        hasNext: listings.length > LISTING_PAGE_SIZE
    };
};

exports.listForSale = async (id, price, sellerPaymentAddress, sellerOrdinalAddress, sellerOrdinalPublicKey) => {
    try {
        const inscription = await getInscription(id);
        let inscriptionName = inscription.inscription_name;
        let collectionName = inscription.collection_name;
        let collectionSlug = inscription.collection_slug;
        if (!collectionSlug) {
            const nft = await models.nft.findOne({where: {inscriptionId: id}});
            if (nft) {
                inscriptionName = nft.get('tokenName');
                collectionName = nft.get('collectionName');
            }
        }
        const psbtBase64 = await getInitPsbt(id, price, sellerPaymentAddress, sellerOrdinalAddress, sellerOrdinalPublicKey);
        await models.listing.create(
            {
                inscriptionId: id,
                listingPrice: price,
                status: 'pendingSeller',
                inscriptionName,
                collectionName,
                collectionSlug: inscription.collection_slug,
                sellerPaymentAddress
            }
        );
        return psbtBase64;
    } catch (err) {
        logger.error(`${LOGGER_PREFIX} list ordinals for sale error: ${err.message}`);
        throw new Error(`Unable to list ordinals for sale: ${err.message}`);
    }
};

exports.saveListing = async (id, psbtBase64, listingPrice) => {
    try {
        const listing = await getListing(id);
        if (listing && listing.get('status') !== 'pendingSeller') {
            throw new Error(`Inscription ${id} is already listed`);
        }

        await verifySellerSignedPsbt(id, psbtBase64);

        listing.set('listingPrice', listingPrice);
        listing.set('signedListingPSBT', psbtBase64);
        listing.set('status', 'active');
        await listing.save();
        return psbtBase64;
    } catch (err) {
        logger.error(`${LOGGER_PREFIX} save listing error: ${err.message}`);
        throw new Error(`Unable to save listing: ${err.message}`);
    }
};

exports.updateListing = async (id, price, sellerPaymentAddress, sellerOrdinalAddress, sellerOrdinalPublicKey) => {
    const listing = await getListing(id);
    if (!listing) {
        throw new Error(`Inscription ${id} is not listed`);
    }
    if (listing.get('status') !== 'active') {
        throw new Error(`Listing status for inscription ${id} is not active`);
    }
    if (listing.get('sellerPaymentAddress') !== sellerPaymentAddress) {
        throw new Error(`Seller address for inscription ${id} doesn't match`);
    }

    const psbtBase64 = await getInitPsbt(id, price, sellerPaymentAddress, sellerOrdinalAddress, sellerOrdinalPublicKey);
    listing.set('signedListingPSBT', psbtBase64);
    listing.set('status', 'pendingSeller');
    await listing.save();

    return psbtBase64;
};

exports.confirmUpdateListing = async (id, psbtBase64, listingPrice) => {
    const listing = await getListing(id);
    if (!listing) {
        throw new Error(`Inscription ${id} is not listed`);
    }
    if (listing.get('status') !== 'pendingSeller') {
        throw new Error(`Listing status for inscription ${id} is not pendingSeller`);
    }

    await verifySellerSignedPsbt(id, psbtBase64);

    listing.set('listingPrice', listingPrice);
    listing.set('signedListingPSBT', psbtBase64);
    listing.set('status', 'active');
    await listing.save();

    return psbtBase64;
};

exports.revertPendingStatus = async (id) => {
    const listing = await getListing(id);
    if (!listing) {
        throw new Error(`Inscription ${id} is not listed`);
    }

    const status = listing.get('status');
    if (status === 'pendingSeller' && !listing.get('signedListingPSBT')) {
        await models.listing.destroy({where: {inscriptionId: id}});
        return;
    }
    if (status === 'pendingSeller' || status === 'pendingBuyer') {
        listing.set('status', 'active');
        await listing.save();
        return;
    }

    throw new Error(`Listing status for inscription ${id} is not in pending status`);
};

exports.deleteListing = async (id, sellerPaymentAddress, sellerOrdinalAddress, sellerOrdinalPublicKey) => {
    const listing = await getListing(id);
    if (!listing) {
        throw new Error(`Inscription ${id} is not listed`);
    }
    if (listing.get('status') !== 'active') {
        throw new Error(`Listing status for inscription ${id} is not active`);
    }

    const psbtBase64 = getInitPsbt(id, DELIST_PRICE, sellerPaymentAddress, sellerOrdinalAddress, sellerOrdinalPublicKey);
    await listing.save();

    return psbtBase64;
};

exports.confirmDeleteListing = async (id, psbtBase64) => {
    const listing = await getListing(id);
    if (!listing) {
        throw new Error(`Inscription ${id} is not listed`);
    }

    await verifySellerSignedPsbt(id, psbtBase64);

    await models.listing.destroy({where: {inscriptionId: id}});
    return psbtBase64;
};

exports.createBuyOffer = async (id, buyerPaymentAddress, buyerOrdinalAddress, buyerPaymentPublicKey, buyerOrdinalPublicKey, feeRateTier) => {
    const listing = await getListing(id);
    if (!listing) {
        throw new Error(`Inscription ${id} is not listed`);
    }
    if (listing.get('status') !== 'active') {
        throw new Error(`Listing status for inscription ${id} is not active`);
    }

    const psbt = await getBuyPsbt(buyerPaymentAddress, buyerPaymentPublicKey, buyerOrdinalAddress, id, feeRateTier);
    return psbt;
};

exports.saveBuyOffer = async (id, psbtBase64, feeRateTier) => {
        const listing = await getListing(id);
        if (!listing) {
            throw new Error(`Inscription ${id} is not listed`);
        }

        listing.set('signedBuyerPSBT', psbtBase64);
        await listing.save();

        const txId = await broadcastPurchase(id, feeRateTier);
        listing.set('broadcastTxId', txId);
        listing.set('status', 'pendingTransaction');
        await listing.save();
        return psbtBase64;
};

exports.getDummyUtxosPsbt = async (buyerAddress, buyerPublicKey, feeRateTier) => {
    return await generateDummyUtxosPsbt(buyerAddress, buyerPublicKey, feeRateTier);
};

exports.broadcastSignedDummyUtxosPsbt = async (signedPsbt, feeRateTier) => {
    const buyerAddress = getOutputAddressFromPsbt(signedPsbt);
    const txid = await broadcastSignedPsbt(signedPsbt, feeRateTier);
    let attempts = 1;
    const maxAttempts = 3;
    let delay = 1000; // 1 second in milliseconds
    const retryDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    while (attempts < maxAttempts) {
        attempts++;
        const selectedDummyUtxos = await getDummyUtxos(buyerAddress);
        if (selectedDummyUtxos !== null && selectedDummyUtxos.length >= 2) {
            return txid;
        }
        if (attempts <= maxAttempts) {
            await retryDelay(delay * attempts);
        } else {
            throw new Error('Maximum retry attempts reached. Could not select enough dummy UTXOs.');
        }
    }
};

async function getListing(inscriptionId) {
    return await models.listing.findOne({where: {inscriptionId}});
}
