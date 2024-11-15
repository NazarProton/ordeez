const _ = require('lodash');
const { errorResponse, reducedErrorMessage } = require("../modules/utils");
const models = require('../models');
const { Op} = require("sequelize");
const { getListByIds } = require('../services/inscriptionListService');
const { getLastListed, getLastSold } = require('../services/marketplaceService');

exports.getActivity = async (req, res) => {
    try {
        let activity = {};
        const activities = await models.activity.findAll({
            order: [
                ['updatedAt', 'DESC'],
            ],
            limit: 1
        });

        if (activities.length !== 0) {
            activity = _.omit(activities[0].get(), 'id', 'createdAt', 'updatedAt');
        }

        return res.status(200).json({
            success: true,
            data: activity
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.getLatestMigrations = async (req, res) => {
    try {
        const nfts = await models.nft.findAll({
            where: {txId: {[Op.ne]: null}},
            order: [
                ['updatedAt', 'DESC'],
            ],
            limit: 1
        });
        const inscriptionIds = nfts.map((n) => n.get('inscriptionId'));
        const inscriptions = await getListByIds(inscriptionIds);

        return res.status(200).json({
            success: true,
            data: inscriptions
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.getLatestListings = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: await getLastListed()
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};

exports.getLatestSales = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: await getLastSold()
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};
