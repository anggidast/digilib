const { EBook, Account, borrow_log } = require('../models');
const { Op } = require('sequelize');

class Controller {
  static findAll(req, res) {
    let search = req.query.search || '';
    let email = req.session.email || null;
    let session;
    Account.findOne({ where: { email: email } })
      .then(data => {
        req.app.locals.session = data;
        session = req.app.locals.session
        if (session.role == 'reader') {
          return EBook.findAll({
            where: {
              title: {
                [Op.iLike]: `%${search}%`
              },
              copies: {
                [Op.gt]: 0
              }
            },
            order: ['id']
          })
        } else {
          return EBook.findAll({
            where: {
              title: {
                [Op.iLike]: `%${search}%`
              }
            },
            order: ['id']
          })
        }
      })
      .then(data => res.render('ebooks', { data, session }))
      .catch(err => res.send(err));
  }

  static getAdd(req, res) {
    let session = req.app.locals.session || null;
    res.render('ebook-form', { data: null, session });
  }

  static postAdd(req, res) {
    EBook.create(req.body)
      .then(() => res.redirect('/ebooks'))
      .catch(err => res.send(err));
  }

  static getEdit(req, res) {
    let session = req.app.locals.session || null;
    EBook.findByPk(req.params.id)
      .then(data => res.render('ebook-form', { data, session }))
      .catch(err => res.send(err));
  }

  static postEdit(req, res) {
    EBook.update(req.body, { where: req.params })
      .then(() => res.redirect('/ebooks'))
      .catch(err => res.send(err));
  }

  static details(req, res) {
    let session = req.app.locals.session || null;
    EBook.findByPk(req.params.id, {
        include: [Account],
        through: {
          attributes: ['createdAt', 'return_date']
        }
      })
      .then(data => res.render('ebook-details', { data, session }))
      .catch(err => res.send(err));
  }

  static destroy(req, res) {
    EBook.destroy({ where: req.params })
      .then(() => res.redirect('/ebooks'))
      .catch(err => res.send(err));
  }

  static borrow(req, res) {
    // let email = req.session.email || null;
    // let account;
    let session = req.app.locals.session || null;
    EBook.decrement('copies', { where: req.params })
      // .then(() => Account.findOne({ where: { email: email } }))
      .then(() => {
        // account = data;
        return borrow_log.create({
          AccountId: session.id,
          EBookId: req.params.id,
          return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      })
      .then(() => res.redirect('/ebooks'))
      .catch(err => res.send(err));
  }
}

module.exports = Controller;