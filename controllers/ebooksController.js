const { EBook, Account } = require('../models');
const { Op } = require('sequelize');

class Controller {
  static findAll(req, res) {
    EBook.findAll({
        // where: {
        //   copies: {
        //     [Op.gt]: 0
        //   }
        // },
        order: ['id']
      })
      .then(data => res.render('ebooks', { data }))
      .catch(err => res.send(err));
  }

  static getAdd(req, res) {
    res.render('ebook-form', { data: null });
  }

  static postAdd(req, res) {
    EBook.create(req.body)
      .then(() => res.redirect('/ebooks'))
      .catch(err => res.send(err));
  }

  static getEdit(req, res) {
    EBook.findByPk(req.params.id)
      .then(data => res.render('ebook-form', { data }))
      .catch(err => res.send(err));
  }

  static postEdit(req, res) {
    EBook.update(req.body, { where: req.params })
      .then(() => res.redirect('/ebooks'))
      .catch(err => res.send(err));
  }

  static details(req, res) {
    EBook.findByPk(req.params.id, { include: [Account] })
      .then(data => res.render('ebook-details', { data }))
      .catch(err => res.send(err));
  }

  static destroy(req, res) {
    EBook.destroy({ where: req.params })
      .then(() => res.redirect('/ebooks'))
      .catch(err => res.send(err));
  }
}

module.exports = Controller;