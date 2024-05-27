const express = require('express');
const router = express.Router();
const PasswordController = require('../VendorController/PasswordController');
const {isAuthenticated, isAdmin} = require('../eCommerceUtils/auth')

router.put('/:userId/change-password', isAuthenticated, PasswordController.changePassword);
router.post('/forgot-password', PasswordController.requestPasswordReset);
router.post('/reset-password', PasswordController.resetPassword);

module.exports = router;
