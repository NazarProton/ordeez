const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const listing = sequelize.define('listing', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    inscriptionId: {
      type: Sequelize.STRING
    },
    inscriptionName: {
      type: Sequelize.STRING
    },
    collectionName: {
      type: Sequelize.STRING
    },
    collectionSlug: {
      type: Sequelize.STRING
    },
    chainId: {
      type: Sequelize.STRING
    },
    sellerPaymentAddress: {
      type: Sequelize.STRING
    },
    listingPrice: {
      type: Sequelize.STRING
    },
    signedListingPSBT: {
      type: Sequelize.TEXT('long')
    },
    signedBuyerPSBT: {
      type: Sequelize.TEXT('long')
    },
    broadcastTxId: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {});
  // eslint-disable-next-line no-unused-vars
  listing.associate = function(models) {
    // associations can be defined here
  };

  listing.upsert = (values, condition) => (
    listing.findOne({ where: condition })
      .then((obj) => {
        if(obj) {
          return obj.update(values);
        }
        return listing.create(values);
      })
  );
  return listing;
};
