const {errorResponse, reducedErrorMessage} = require("../modules/utils");
const {getList, getInfo, getItems, getListedItems} = require("../services/collectionService");
const {make, ruleIn} = require("simple-body-validator");

exports.getCollectionsList = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: await getList(req.query),
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.getCollectionInfo = async (req, res) => {
    try {
        const { slug } = req.params;
        return res.status(200).json({
            success: true,
            data: await getInfo(slug),
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.getCollectionItems = async (req, res) => {
    try {
        const rules = {
            slug: ['required', 'string'],
            page: ['required', 'numeric']
        };

        const validator = make().setData(req.query).setRules(rules);
        const validationResult = await validator.validateAsync();
        if (!validationResult) {
            return res.status(400).json({status: false, errors: validator.errors().all()});
        }
        const { slug, page } = req.query;
        return res.status(200).json({
            success: true,
            data: await getItems(slug, page),
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.getCollectionListedItems = async (req, res) => {
    try {
        const rules = {
            slug: ['required', 'string'],
            page: ['required', 'numeric'],
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
            data: await getListedItems(slug, page, sort, search),
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};
