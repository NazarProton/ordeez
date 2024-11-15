const {ordinalsbot} = require('../modules/ordinalsbot');
const {logger} = require('../modules/logger');
const models = require("../models");
const {getListByIds} = require("./inscriptionListService");
const config = require("../config");
const axios = require("axios");

const LOGGER_PREFIX = '[SERVICE][ORDINALS]';
const marketPlace = ordinalsbot.MarketPlace();

const options = {
    headers: {'x-api-key': 'ea4bdc6a-9f43-4014-9bd9-a1b81dd41962'}
};

exports.getList = async (page) => {
    page = +page + 1;
    const result = await marketPlace.getListing({page: +page, itemsPerPage: 40});
    const ordinalId = result.results.map(i => i.ordinalId);
    const inscriptions = await getListByIds(ordinalId);

    return {
        inscriptions,
        hasNext: result.totalPages !== result.currentPage
    };
};

exports.getLastListed = async () => {
    const result = await marketPlace.getListing({ itemsPerPage: 4 });
    if (result.count === 0) {
        return [];
    }
    const ordinalId = result.results.map(i => i.ordinalId);
    return await getListByIds(ordinalId);
};

exports.getLastSold = async () => {
    const result = await marketPlace.getListing({ itemsPerPage: 4, filter: { status: 'Sold' } });
    if (result.count === 0) {
        return [];
    }
    const ordinalId = result.results.map(i => i.ordinalId);
    return await getListByIds(ordinalId);
};

exports.listForSale = async (id, price, sellerPaymentAddress, sellerOrdinalPublicKey) => {
    try {
        const sellerOrdinals = [{id, price}];
        // return await marketPlace.createListing({ sellerOrdinals, sellerPaymentAddress, sellerOrdinalPublicKey });
        const request = {
            sellerOrdinals,
            sellerPaymentAddress,
            sellerOrdinalPublicKey
        };

        const response = await axios.post(
            `${config.ordinalsbot.baseUrl}/marketplace/create-listing`,
            request,
            options
        );

        return response.data.psbt;
    } catch (err) {
        logger.error(`${LOGGER_PREFIX} list ordinals for sale error: ${err.message}`);
        throw new Error(`Unable to list ordinals for sale: ${err.message}: ${err.response.data.message}`);
    }
};

exports.saveListing = async (id, psbtBase64, listingPrice) => {
    try {
        // const result = await marketPlace.saveListing({
        //     ordinalId: id,
        //     updateListingData: {signedListingPSBT: psbtBase64}
        // });

        const request = {
            ordinalId: id,
            updateListingData: {signedListingPSBT: psbtBase64}
        };
        const response = await axios.patch(
            `${config.ordinalsbot.baseUrl}/marketplace/save-listing/${id}`,
            request,
            options
        );
        await models.listing.upsert({inscriptionId: id, listingPrice}, {inscriptionId: id});
        return response.data.psbt;
    } catch (err) {
        logger.error(`${LOGGER_PREFIX} save listing error: ${err.message}`);
        throw new Error(`Unable to save listing: ${err.message}: ${err.response.data.message}`);
    }
};

exports.updateListing = async (id, price, sellerPaymentAddress, sellerOrdinalPublicKey) => {
    try {
        const request = {
            ordinalId: id,
            price,
            sellerPaymentAddress,
            sellerOrdinalPublicKey,
        };
        // return await marketPlace.reListing(request);
        const response = await axios.post(
            `${config.ordinalsbot.baseUrl}/marketplace/relist`,
            request,
            options
        );
        return response.data.psbt;
    } catch (err) {
        logger.error(`${LOGGER_PREFIX} update listing error: ${err.message}`);
        throw new Error(`Unable to update: ${err.message}: ${err.response.data.message}`);
    }
};

exports.confirmUpdateListing = async (id, psbtBase64, listingPrice) => {
    try {
        const request = {
            ordinalId: id,
            signedListingPSBT: psbtBase64
        };
        // const result = await marketPlace.confirmReListing();
        const response = await axios.post(
            `${config.ordinalsbot.baseUrl}/marketplace/confirm-relist`,
            request,
            options
        );

        await models.listing.upsert({inscriptionId: id, listingPrice}, {inscriptionId: id});
        return response.data;
    } catch (err) {
        logger.error(`${LOGGER_PREFIX} confirm update listing error: ${err.message}`);
        throw new Error(`Unable to confirm update listing: ${err.message}: ${err.response.data.message}`);
    }
};

exports.deleteListing = async (id, senderPaymentAddress, senderPaymentPublicKey, senderOrdinalAddress) => {
    try {
        const request = {
            ordinalId: id,
            senderPaymentAddress,
            senderPaymentPublicKey,
            senderOrdinalAddress
        };
        // const result = await marketPlace.deList(request);
        const response = await axios.post(
            `${config.ordinalsbot.baseUrl}/marketplace/delist`,
            request,
            options
        );

        await models.listing.destroy({where: {inscriptionId: id}});
        return response.data;
    } catch (err) {
        logger.error(`${LOGGER_PREFIX} delete listing error: ${err.message}`);
        throw new Error(`Unable to delete listing: ${err.message}: ${err.response.data.message}`);
    }
};

exports.createBuyOffer = async (id, buyerPaymentAddress, buyerOrdinalAddress, buyerPaymentPublicKey, feeRateTier) => {
    try {
        const request = {
            ordinalId: id,
            buyerPaymentAddress,
            buyerOrdinalAddress,
            buyerPaymentPublicKey,
            feeRateTier
        };
         // return await marketPlace.createOffer(request);
        const response = await axios.post(
            `${config.ordinalsbot.baseUrl}/marketplace/create-offer`,
            request,
            options
        );
        return response.data;
    } catch (err) {
        logger.error(`${LOGGER_PREFIX} buy offer error: ${err.message}`);
        throw new Error(`Unable to create buy offer: ${err.message}: ${err.response.data.message}`);
    }
};

exports.submitBuyOffer = async (id, psbtBase64) => {
    try {
        const request = {
            ordinalId: id,
            signedBuyerPSBTBase64: psbtBase64
        };
        // const result = await marketPlace.submitOffer({
        //     ordinalId: id,
        //     signedBuyerPSBTBase64: psbtBase64
        // });
        const response = await axios.post(
            `${config.ordinalsbot.baseUrl}/marketplace/submit-offer`,
            request,
            options
        );
        await models.listing.destroy({where: {inscriptionId: id}});
        return response.data;
    } catch (err) {
        logger.error(`${LOGGER_PREFIX} submit offer error: ${err.message}`);
        throw new Error(`Unable to submit offer: ${err.message}: ${err.response.data.message}`);
    }
};
