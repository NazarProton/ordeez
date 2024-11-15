const { make, ruleIn } = require("simple-body-validator");
const { errorResponse, reducedErrorMessage, errorResponseWithCode} = require("../modules/utils");
const {
    getList,
    listForSale,
    saveListing,
    updateListing,
    confirmUpdateListing,
    deleteListing,
    confirmDeleteListing,
    createBuyOffer,
    saveBuyOffer,
    revertPendingStatus,
    getDummyUtxosPsbt,
    broadcastSignedDummyUtxosPsbt
} = require("../services/marketplaceService");

exports.listOrdinals = async (req, res) => {
    const { page } = req.params;
    try {
        return res.status(200).json({
            success: true,
            data: await getList(page)
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.listListings = async (req, res) => {
    try {
        const rules = {
            page: ['required', 'numeric'],
            slug: ['string'],
            sort: [ruleIn(['recent', 'lowPrice', 'highPrice'])],
            search: ['string'] //by listing name after "inscription name" implementation
        };

        const validator = make().setData(req.query).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const { slug, page, sort, search } = req.query;
        return res.status(200).json({
            success: true,
            data: await getList(page, slug, sort, search),
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.listOrdinalsForSale = async (req, res) => {
    const rules = {
        id: ['required', 'string'],
        price: ['required', 'numeric'],
        sellerPaymentAddress: ['required', 'string'],
        sellerOrdinalAddress: ['required', 'string'],
        sellerOrdinalPublicKey: ['required', 'string']
    };
    const validator = make().setData(req.body).setRules(rules);
    const validationResult = await validator.validateAsync();
    if (!validationResult) {
        return res.status(400).json({status: false, errors: validator.errors().all()});
    }

    const {
        id,
        price,
        sellerPaymentAddress,
        sellerOrdinalAddress,
        sellerOrdinalPublicKey,
    } = req.body;

    try {
        const psbtBase64 = await listForSale(id, price, sellerPaymentAddress, sellerOrdinalAddress, sellerOrdinalPublicKey);
        return res.status(200).json({
            success: true,
            data: { psbtBase64 }
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.saveListing = async (req, res) => {
    try {
        const rules = {
            id: ['required', 'string'],
            psbtBase64: ['required', 'string'],
            listingPrice: ['required', 'numeric']
        };

        const validator = make().setData(req.body).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const { id, psbtBase64, listingPrice } = req.body;

        const result = await saveListing(id, psbtBase64, listingPrice);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.updateListing = async (req, res) => {
    const rules = {
        id: ['required', 'string'],
        price: ['required', 'numeric'],
        sellerPaymentAddress: ['required', 'string'],
        sellerOrdinalAddress: ['required', 'numeric'],
        sellerOrdinalPublicKey: ['required', 'string']
    };
    const validator = make().setData(req.body).setRules(rules);
    const validationResult = await validator.validateAsync();
    if (!validationResult) {
        return res.status(400).json({status: false, errors: validator.errors().all()});
    }

    const {
        id,
        price,
        sellerPaymentAddress,
        sellerOrdinalAddress,
        sellerOrdinalPublicKey
    } = req.body;

    try {
        const psbtBase64 = await updateListing(id, price, sellerPaymentAddress, sellerOrdinalAddress, sellerOrdinalPublicKey);
        return res.status(200).json({
            success: true,
            data: { psbtBase64 }
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.confirmUpdateListing = async (req, res) => {
    try {
        const rules = {
            id: ['required', 'string'],
            psbtBase64: ['required', 'string'],
            listingPrice: ['required', 'numeric']
        };

        const validator = make().setData(req.body).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const { id, psbtBase64, listingPrice } = req.body;

        const result = await confirmUpdateListing(id, psbtBase64, listingPrice);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.revertPendingStatus = async (req, res) => {
    try {
        const rules = {
            id: ['required', 'string']
        };

        const validator = make().setData(req.body).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const { id } = req.body;
        await revertPendingStatus(id);
        return res.status(200).json({
            success: true
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.deleteListing = async (req, res) => {
    try {
        const rules = {
            id: ['required', 'string'],
            sellerPaymentAddress: ['required', 'string'],
            sellerOrdinalAddress: ['required', 'string'],
            sellerOrdinalPublicKey: ['required', 'string'],
        };
        const validator = make().setData(req.body).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const { id, sellerOrdinalAddress, sellerOrdinalPublicKey } = req.body;

        const psbtBase64 = await deleteListing(id, sellerPaymentAddress, sellerOrdinalAddress, sellerOrdinalPublicKey);
        return res.status(200).json({
            success: true,
            data: { psbtBase64 }
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.confirmDeleteListing = async (req, res) => {
    try {
        const rules = {
            id: ['required', 'string'],
            psbtBase64: ['required', 'string']
        };

        const validator = make().setData(req.body).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const { id, psbtBase64 } = req.body;

        const result = await confirmDeleteListing(id, psbtBase64);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.createBuyOffer = async (req, res) => {
    try {
        const rules = {
            id: ['required', 'string'],
            buyerPaymentAddress: ['required', 'string'],
            buyerPaymentPublicKey: ['required', 'string'],
            buyerOrdinalAddress: ['required', 'string'],
            buyerOrdinalPublicKey: ['required', 'string'],
            feeRateTier: ['required', ruleIn(['fastestFee', 'halfHourFee', 'hourFee', 'minimumFee'])]
        };

        const validator = make().setData(req.body).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const {
            id,
            buyerPaymentAddress,
            buyerPaymentPublicKey,
            buyerOrdinalAddress,
            buyerOrdinalPublicKey,
            feeRateTier
        } = req.body;

        const psbt = await createBuyOffer(id, buyerPaymentAddress, buyerOrdinalAddress, buyerPaymentPublicKey, buyerOrdinalPublicKey, feeRateTier);
        return res.status(200).json({
            success: true,
            data: psbt
        });
    } catch (err) {
        return errorResponseWithCode(res, reducedErrorMessage(err), err.name);
    }
};

exports.submitBuyOffer = async (req, res) => {
    try {
        const rules = {
            id: ['required', 'string'],
            psbtBase64: ['required', 'string'],
            feeRateTier: ['required', ruleIn(['fastestFee', 'halfHourFee', 'hourFee', 'minimumFee'])]
        };

        const validator = make().setData(req.body).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const { id, psbtBase64, feeRateTier } = req.body;

        const result = await saveBuyOffer(id, psbtBase64, feeRateTier);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.getDummyUtxosPsbt = async (req, res) => {
    try {
        const rules = {
            buyerPaymentAddress: ['required', 'string'],
            buyerPaymentPublicKey: ['required', 'string'],
            feeRateTier: ['required', ruleIn(['fastestFee', 'halfHourFee', 'hourFee', 'minimumFee'])]
        };

        const validator = make().setData(req.body).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const {
            buyerPaymentAddress,
            buyerPaymentPublicKey,
            feeRateTier
        } = req.body;

        const psbt = await getDummyUtxosPsbt(buyerPaymentAddress, buyerPaymentPublicKey, feeRateTier);
        return res.status(200).json({
            success: true,
            data: {psbt}
        });
    } catch (err) {
        return errorResponseWithCode(res, reducedErrorMessage(err), err.name);
    }
};

exports.broadcastPsbt = async (req, res) => {
    try {
        const rules = {
            signedPsbt: ['required', 'string'],
            feeRateTier: ['required', ruleIn(['fastestFee', 'halfHourFee', 'hourFee', 'minimumFee'])]
        };

        const validator = make().setData(req.body).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const { signedPsbt, feeRateTier } = req.body;

        const txId = await broadcastSignedDummyUtxosPsbt(signedPsbt, feeRateTier);
        return res.status(200).json({
            success: true,
            data: {txId}
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};
