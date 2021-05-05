const express = require('express');
const session = require('express-session')
const router = express.Router();
const { Account } = require('../models');
const { hash, compareHash } = require('../helpers/bcrypt');
const accountsRoute = require('./accountsRoute');
const ebooksRoute = require('./ebooksRoute');

router.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

router.get('/home', (req, res) => {
  if (req.session.isLogin) {
    // let name = req.session.email || null;
    res.render('home');
  } else {
    res.redirect('/login');
  }
});


router.get('/', (req, res) => {
  if (!req.session.isLogin) {
    let error = req.query.err || null
    res.render('login', { error });
  } else {
    res.redirect('/home')
  }
});

router.post('/', (req, res) => {
  Account.findOne({
      where: {
        email: req.body.email
      }
    })
    .then(user => {
      if (user) {
        if (compareHash(req.body.password, user.password)) {
          req.session.isLogin = true;
          req.session.email = user.email
          res.redirect('/home');
        } else {
          throw new Error("Password tidak sesuai");
        }
      } else {
        throw new Error('Email tidak sesuai');
      }
    })
    .catch((err) => {
      res.redirect('/?err=' + err.message)
    });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) res.send(err)
    res.redirect('/')
  });
});

router.use('/accounts', accountsRoute);
router.use('/ebooks', ebooksRoute);

module.exports = router;