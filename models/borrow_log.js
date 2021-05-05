'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class borrow_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      borrow_log.belongsTo(models.Account, { foreignKey: 'AccountId' });
      borrow_log.belongsTo(models.EBook, { foreignKey: 'EBookId' });
    }
  };
  borrow_log.init({
    AccountId: DataTypes.INTEGER,
    EBookId: DataTypes.INTEGER,
    days: DataTypes.INTEGER,
    return_date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'borrow_log',
  });
  return borrow_log;
};