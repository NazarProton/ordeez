const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const nft = sequelize.define('nft', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    hash: {
      type: Sequelize.STRING
    },
    chainId: {
      type: Sequelize.INTEGER
    },
    collectionAddress: {
      type: Sequelize.STRING
    },
    tokenId: {
      type: Sequelize.STRING
    },
    collectionName: {
      type: Sequelize.STRING
    },
    tokenName: {
      type: Sequelize.STRING
    },
    imageUrl: {
      type: Sequelize.TEXT
    },
    filename: {
      type: Sequelize.STRING
    },
    migrator: {
      type: Sequelize.STRING
    },
    inscriptionId: {
      type: Sequelize.STRING
    },
    inscriptionStatus: {
      type: Sequelize.STRING
    },
    orderId: {
      type: Sequelize.STRING
    },
    orderStatus: {
      type: Sequelize.STRING
    },
    orderComplete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    txId: {
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
  nft.associate = function(models) {
    // associations can be defined here
  };

  nft.upsert = (values, condition) => (
    nft.findOne({ where: condition })
      .then((obj) => {
        if(obj) {
          return obj.update(values);
        }
        return nft.create(values);
      })
  );
  return nft;
};
