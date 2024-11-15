const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const activity = sequelize.define('activity', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    migratedNfts: {
      type: Sequelize.STRING
    },
    uniqueUsers: {
      type: Sequelize.STRING
    },
    earnedByTraders: {
      type: Sequelize.STRING
    },
    soldOrdinals: {
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
  activity.associate = function(models) {
    // associations can be defined here
  };

  activity.upsert = (values, condition) => (
    activity.findOne({ where: condition })
      .then((obj) => {
        if(obj) {
          return obj.update(values);
        }
        return activity.create(values);
      })
  );
  return activity;
};
