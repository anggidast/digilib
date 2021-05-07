const express = require('express');
const session = require('express-session')
const router = express.Router();
const { Account } = require('../models');
const { compareHash } = require('../helpers/bcrypt');
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
    let email = req.session.email || null;
    Account.findOne({ where: { email: email } })
      .then(session => res.render('home', { session }))
      .catch(err => res.send(err));
  } else {
    res.redirect('/');
  }
});

router.get('/', (req, res) => {
  if (!req.session.isLogin) {
    let error = req.query.err || null
    let success = req.query.success || null
    res.render('login', { error, success });
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
          console.log('proc')
          console.log(user)
          req.session.isLogin = true;
          req.session.email = user.email;
          console.log(req.user.email)
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
  delete req.app.locals.session;
});

router.get('/newaccount', (req, res) => {
  res.render('newaccount');
});

router.post('/newaccount', (req, res) => {
  Account.create({
      name: req.body.name,
      role: 'reader',
      email: req.body.email,
      password: req.body.password
    })
    .then(() => {
      let success = 'New account created, you can login now!';
      res.redirect('/?success=' + success);
    })
    .catch(err => res.send(err));
})

router.use('/accounts', accountsRoute);
router.use('/ebooks', ebooksRoute);

module.exports = router;