const express = require('express');
const router = express.Router();
const vendorAddressController = require('../VendorController/VendorAddressController');
const {isAuthenticated, isAdmin} = require('../eCommerceUtils/auth')
const upload = require("../eCommerceUtils/multer")


router.post('/vendorAddress', isAuthenticated, vendorAddressController.vendorAddress);
router.get('/getVendorAddresses', vendorAddressController.getAllVendorAddresses);
router.put('/updateVendorAddress',upload.single('image'),isAuthenticated, vendorAddressController.updateVendorAddress);

module.exports = router;
