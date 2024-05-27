const express = require('express');
const router = express.Router();
const userController = require('../eCommerceControllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/forgot-password', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.get('/users', userController.getUsers);

module.exports = router;
