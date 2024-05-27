const express = require('express');
const router = express.Router();
const userController = require('../VendorController/UserController');
const {isAuthenticated, isAdmin} = require('../eCommerceUtils/auth')
const upload = require("../eCommerceUtils/multer")

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/create-role', isAuthenticated, isAdmin, userController.createRole);
router.get('/admins', userController.getAdmins);
router.get('/vendors', userController.getVendors);
router.get('/deliveries', userController.getDeliveries);
router.get('/users', userController.getUsers);
module.exports = router;
