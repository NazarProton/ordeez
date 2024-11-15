const {errorResponse, reducedErrorMessage} = require("../modules/utils");
const {getFullInscription} = require("../services/inscriptionListService");

exports.getInscription = async (req, res) => {
    try {
        const { id } = req.params;
        return res.status(200).json({
            success: true,
            data: await getFullInscription(id),
        });
    } catch (err) {
        return errorResponse(res, reducedErrorMessage(err));
    }
};
