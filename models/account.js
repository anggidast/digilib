'use strict';
const { hash } = require('../helpers/bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsToMany(models.EBook, { through: 'borrow_log' });
      Account.hasMany(models.borrow_log, { foreignKey: 'AccountId' });
    }

  };
  Account.init({
    name: DataTypes.STRING,
    role: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Account',
  });
  Account.beforeCreate(account => {
    account.password = hash(account.password);
  })
  return Account;
};