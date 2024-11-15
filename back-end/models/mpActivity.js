const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const mpActivity = sequelize.define('mpActivity', {
    inscriptionName: {
      type: Sequelize.STRING
    },
    collectionName: {
      type: Sequelize.STRING
    },
    migrated: {
      type: Sequelize.BOOLEAN
    },
    contentUrl: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
    price: {
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
  mpActivity.associate = function(models) {
    // associations can be defined here
  };

  mpActivity.upsert = (values, condition) => (
    mpActivity.findOne({ where: condition })
      .then((obj) => {
        if(obj) {
          return obj.update(values);
        }
        return mpActivity.create(values);
      })
  );
  return mpActivity;
};
