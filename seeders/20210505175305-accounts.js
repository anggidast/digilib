'use strict';
const accounts = require('./accounts.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    accounts.forEach(el => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    return queryInterface.bulkInsert('Accounts', accounts, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Accounts', null, {});
  }
};