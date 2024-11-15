const { make, ruleIn } = require("simple-body-validator");
const { errorResponse, reducedErrorMessage } = require("../modules/utils");
const { getList, listForSale, saveListing, updateListing, confirmUpdateListing, deleteListing, createBuyOffer } = require("../services/ordinalsService");

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

exports.listOrdinalsForSale = async (req, res) => {
    const rules = {
        id: ['required', 'string'],
        price: ['required', 'numeric'],
        sellerPaymentAddress: ['required', 'string'],
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
        sellerOrdinalPublicKey,
    } = req.body;

    try {
        const psbt = await listForSale(id, price, sellerPaymentAddress, sellerOrdinalPublicKey);
        return res.status(200).json({
            success: true,
            data: { psbt }
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
        sellerOrdinalPublicKey
    } = req.body;

    try {
        const psbt = await updateListing(id, price, sellerPaymentAddress, sellerOrdinalPublicKey);
        return res.status(200).json({
            success: true,
            data: { psbt }
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

exports.deleteListing = async (req, res) => {
    try {
        const rules = {
            id: ['required', 'string'],
            sellerPaymentAddress: ['required', 'string'],
            sellerOrdinalPublicKey: ['required', 'string'],
            senderOrdinalAddress: ['required', 'string']
        };
        const validator = make().setData(req.body).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const { id, sellerPaymentAddress, sellerOrdinalPublicKey, senderOrdinalAddress } = req.body;

        const result = await deleteListing(id, sellerPaymentAddress, sellerOrdinalPublicKey, senderOrdinalAddress );
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
            buyerOrdinalAddress: ['required', 'string'],
            buyerPaymentPublicKey: ['required', 'string'],
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
            buyerOrdinalAddress,
            buyerPaymentPublicKey,
            feeRateTier
        } = req.body;

        const result = await createBuyOffer(id, buyerPaymentAddress, buyerOrdinalAddress, buyerPaymentPublicKey, feeRateTier);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.submitBuyOffer = async (req, res) => {
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

        const result = await saveListing(id, psbtBase64);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};
