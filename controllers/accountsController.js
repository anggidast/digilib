const { EBook, Account, borrow_log } = require('../models');
const sendMail = require('../helpers/nodemailer');

class Controller {
  static findAll(req, res) {
    if (req.session.isLogin) {
      let email = req.session.email || null;
      let session;
      Account.findOne({ where: { email: email } })
        .then((data) => {
          req.app.locals.session = data;
          session = req.app.locals.session;
          if (data.role == 'admin') {
            return Account.findAll({
              include: [EBook],
              where: {
                role: 'reader'
              },
              order: ['id']
            })
          } else res.redirect('accounts/details/' + data.id);
        })
        .then(data => res.render('accounts', { data, session }))
        .catch(err => res.send(err));
    } else {
      res.redirect('/');
    }
  }

  static getAdd(req, res) {
    if (req.session.isLogin) {
      let session = req.app.locals.session || null;
      res.render('account-form', { data: null, session });
    } else {
      res.redirect('/');
    }
  }

  static postAdd(req, res) {
    Account.create({
        name: req.body.name,
        role: 'reader',
        email: req.body.email,
        password: req.body.password
      })
      .then(() => res.redirect('/accounts'))
      .catch(err => res.send(err));
  }

  static getEdit(req, res) {
    if (req.session.isLogin) {
      let session = req.app.locals.session || null;
      Account.findByPk(req.params.id)
        .then(data => {
          res.render('account-form', { data, session })
        })
        .catch(err => res.send(err));
    } else {
      res.redirect('/');
    }
  }

  static postEdit(req, res) {
    Account.update(req.body, { where: req.params })
      .then(() => res.redirect('/accounts'))
      .catch(err => res.send(err));
  }

  static reminder(req, res) {
    if (req.session.isLogin) {
      borrow_log.findByPk(req.params.id, { include: [Account, EBook] })
        .then(data => {
          sendMail(data.Account.email, data.Account.name, data.EBook.title, err => {
            if (err) {
              req.app.locals.err = err
              res.redirect('/accounts/details/' + data.Account.id);
            } else {
              req.app.locals.success = 'Email reminder berhasil dikirim';
              res.redirect('/accounts/details/' + data.Account.id);
            }
          })
        })
        .catch(err => res.send(err));
    } else {
      res.redirect('/');
    }
  }

  static details(req, res) {
    if (req.session.isLogin) {
      let session;
      let email = req.session.email || null;
      let err = req.app.locals.err || null;
      let success = req.app.locals.success || null;
      let rb = req.query.rb || null;

      delete req.app.locals.err;
      delete req.app.locals.success;

      Account.findOne({ where: { email: email } })
        .then(data => {
          session = data;
          return Account.findByPk(req.params.id, { include: [EBook] })
        })
        .then(data => res.render('account-details', { data, session, err, success, rb }))
        .catch(err => res.send(err));
    } else {
      res.redirect('/');
    }
  }

  static destroy(req, res) {
    if (req.session.isLogin) {
      Account.destroy({ where: req.params })
        .then(() => res.redirect('/accounts'))
        .catch(err => res.send(err));
    } else {
      res.redirect('/');
    }
  }

  static rollback(req, res) {
    let log;
    let title;
    borrow_log.findByPk(req.params.id, { include: [Account, EBook] })
      .then(data => {
        title = data.EBook.title;
        log = data;
        return EBook.increment('copies', { where: { id: log.EBookId } })
      })
      .then(() => borrow_log.destroy({ where: req.params }))
      .then(() => {
        let rb = `E-Book berjudul ${title} berhasil dikembalikan`;
        res.redirect('/accounts/details/' + log.AccountId + '?rb=' + rb);
      })
      .catch(err => res.send(err));
  }
}

module.exports = Controller;