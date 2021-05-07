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

    // days(borrowed_day) {
    //   return borrowDays(new Date(), borrowed_day);
    // }

    ebookId() {
      return this.genre[0] + this.genre[1].toUpperCase() + this.id;
    }
  };
  EBook.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "Please input title"}
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "Please input author"}
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "Please input genre"}
      }
    },
    copies: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EBook',
  });
  return EBook;
};