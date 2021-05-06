const { EBook, Account, borrow_log } = require('../models');
const express = require('express');
const { Op } = require('sequelize');
const borrowDays = require('../helpers/borrowDays');

class Controller {
  static findAll(req, res) {
    let account;
    let search = req.query.search || '';
    let email = req.session.email || null;
    Account.findOne({ where: { email: email } })
      .then(data => {
        account = data;
        if (account.role == 'reader') {
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
      .then(data => res.render('ebooks', { data, account }))
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

  static borrow(req, res) {
    let email = req.session.email || null;
    let account;

    EBook.decrement('copies', { where: req.params })
      .then(() => Account.findOne({ where: { email: email } }))
      .then(data => {
        account = data;
        return borrow_log.create({
          AccountId: account.id,
          EBookId: req.params.id,
          days: 0,
          return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      })
      .then((data) => res.redirect('/ebooks'))
      .catch(err => res.send(err));
  }
}

module.exports = Controller;