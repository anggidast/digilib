const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ebooksController');

router.get('/', Controller.findAll);
router.get('/add', Controller.getAdd);
router.post('/add', Controller.postAdd);
router.get('/edit/:id', Controller.getEdit);
router.post('/edit/:id', Controller.postEdit);
router.get('/details/:id', Controller.details);
router.get('/destroy/:id', Controller.destroy);

module.exports = router;