const { EBook, Account, borrow_log } = require('../models');
const { Op } = require('sequelize');

class Controller {
  static findAll(req, res) {
    if (req.session.isLogin) {
      let search = req.query.search || '';
      let email = req.session.email || null;
      let err = req.query.err || null;
      let success = req.query.success || null;
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
        .then(data => res.render('ebooks', { data, session, err, success }))
        .catch(err => res.send(err));
    } else {
      res.redirect('/');
    }
  }

  static getAdd(req, res) {
    if (req.session.isLogin) {
      let session = req.app.locals.session || null;
      res.render('ebook-form', { data: null, session });
    } else {
      res.redirect('/');
    }
  }

  static postAdd(req, res) {
    EBook.create(req.body)
      .then(() => res.redirect('/ebooks'))
      .catch(err => res.send(err));
  }

  static getEdit(req, res) {
    if (req.session.isLogin) {
      let session = req.app.locals.session || null;
      EBook.findByPk(req.params.id)
        .then(data => res.render('ebook-form', { data, session }))
        .catch(err => res.send(err));
    } else {
      res.redirect('/');
    }
  }

  static postEdit(req, res) {
    EBook.update(req.body, { where: req.params })
      .then(() => res.redirect('/ebooks'))
      .catch(err => res.send(err));
  }

  static details(req, res) {
    if (req.session.isLogin) {
      let session = req.app.locals.session || null;
      EBook.findByPk(req.params.id, {
          include: [Account],
          through: {
            attributes: ['createdAt', 'return_date']
          }
        })
        .then(data => res.render('ebook-details', { data, session }))
        .catch(err => res.send(err));
    } else {
      res.redirect('/');
    }
  }

  static destroy(req, res) {
    if (req.session.isLogin) {
      EBook.destroy({ where: req.params })
        .then(() => res.redirect('/ebooks'))
        .catch(err => res.send(err));
    } else {
      res.redirect('/');
    }
  }

  static borrow(req, res) {
    if (req.session.isLogin) {
      let session = req.app.locals.session || null;
      borrow_log.findOne({
          include: [EBook],
          where: {
            AccountId: session.id,
            EBookId: req.params.id
          }
        })
        .then((data) => {
          if (data == null) return EBook.decrement('copies', { where: req.params })
          else {
            let err = `E-Books berjudul ${data.EBook.title} sudah kamu pinjam`
            res.redirect('/ebooks?err=' + err);
          }
        })
        .then(() => {
          return borrow_log.create({
            AccountId: session.id,
            EBookId: req.params.id,
            return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          });
        })
        .then(() => {
          return borrow_log.findOne({
            include: [EBook],
            where: {
              EBookId: req.params.id
            }
          });
        })
        .then((data) => {
          let success = `E-Books berjudul ${data.EBook.title} berhasil kamu pinjam`;
          res.redirect('/ebooks?success=' + success);
        })
        .catch(err => res.send(err));
    } else {
      res.redirect('/');
    }
  }
}

module.exports = Controller;