'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EBook.belongsToMany(models.Account, { through: 'borrow_log' });
      EBook.hasMany(models.borrow_log, { foreignKey: 'EBookId' });
    }

    ebookId() {
      return this.genre[0] + this.genre[1].toUpperCase() + this.id;
    }
  };
  EBook.init({
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    copies: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EBook',
  });
  return EBook;
};