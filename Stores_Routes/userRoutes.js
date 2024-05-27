const express = require('express');
const router = express.Router();
const userController = require('../StoresController/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/users', userController.getUsers);

module.exports = router;
