'use strict';
const borrowDays = require('../helpers/borrowDays');
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

    days(borrowed_day) {
      return borrowDays(new Date(), borrowed_day);
    }
  };
  borrow_log.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    AccountId: DataTypes.INTEGER,
    EBookId: DataTypes.INTEGER,
    return_date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'borrow_log',
  });
  // borrow_log.beforeCreate(log => {
  //   const today = new Date();
  //   log.days = borrowDays(today, log.createdAt);
  //   console.log(days);
  // })
  return borrow_log;
};