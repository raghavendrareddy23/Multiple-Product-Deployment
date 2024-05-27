const express = require('express');
const router = express.Router();
const userAddressController = require('../VendorController/UserAddressController');
const {isAuthenticated, isAdmin} = require('../eCommerceUtils/auth')
const upload = require("../eCommerceUtils/multer")

router.post('/userAddress', isAuthenticated, userAddressController.userAddress);

router.get('/getUserAddresses', userAddressController.getAllUserAddresses);

router.put('/updateAddress',upload.single('image'),isAuthenticated, userAddressController.updateUserAddress);

module.exports = router;
