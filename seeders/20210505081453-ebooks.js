'use strict';
const ebooks = require('./ebooks.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    ebooks.forEach(el => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    return queryInterface.bulkInsert('EBooks', ebooks, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('EBooks', null, {});
  }
};