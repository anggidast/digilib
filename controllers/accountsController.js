const { EBook, Account } = require('../models');
const { hash, compareHash } = require('../helpers/bcrypt');

class Controller {
  static findAll(req, res) {
    Account.findAll({
        include: [EBook],
        where: {
          role: 'reader'
        },
        order: ['id']
      })
      .then(data => res.render('accounts', { data }))
      .catch(err => res.send(err));
  }

  static getAdd(req, res) {
    res.render('account-form', { data: null });
  }

  static postAdd(req, res) {
    req.body.role = 'reader';
    Account.create(req.body)
      .then(() => res.redirect('/accounts'))
      .catch(err => res.send(err));
  }

  static getEdit(req, res) {
    Account.findByPk(req.params.id)
      .then(data => {
        res.render('account-form', { data })
      })
      .catch(err => res.send(err));
  }

  static postEdit(req, res) {
    Account.update(req.body, { where: req.params })
      .then(() => res.redirect('/accounts'))
      .catch(err => res.send(err));
  }

  static reminder(req, res) {
    Account.findByPk(req.params.id)
      .then(data => res.render('reminder', { data }))
      .catch(err => res.send(err));
  }

  static details(req, res) {
    Account.findByPk(req.params.id, { include: [EBook] })
      .then(data => res.render('account-details', { data }))
      .catch(err => res.send(err));
  }

  static destroy(req, res) {
    Account.destroy({ where: req.params })
      .then(() => res.redirect('/accounts'))
      .catch(err => res.send(err));
  }
}

module.exports = Controller;