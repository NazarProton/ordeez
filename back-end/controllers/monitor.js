const models = require('../models');
const { reducedErrorMessage, errorResponse } = require('../modules/utils');

exports.getMonitor = async (req, res) => { // eslint-disable-line
  return res.json({ status: 'ok', message: 'Server is working now !' });
};

exports.getMonitorDb = async (req, res) => models.sequelize
  .authenticate()
  .then(() => res.json({ status: 'ok', message: 'Db is working now !' }))
  .catch(err => errorResponse(res, reducedErrorMessage(err)));

exports.truncate = async (req, res) => {
  try {
    switch(req.body.tableName) {
      case 'assets':
        models.asset.truncate();
        break;
      default:
        return errorResponse(res, 'undefined');
    }

    return res.status(200).json({ status: true });
  } catch(err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};
