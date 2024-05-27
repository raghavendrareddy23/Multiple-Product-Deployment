const express = require('express');
const router = express.Router();
const deliveryBoyAddressController = require('../VendorController/DeliveryBoyAddressController');
const {isAuthenticated} = require('../eCommerceUtils/auth')
const upload = require("../eCommerceUtils/multer")


router.post('/deliveryBoyAddress', isAuthenticated, deliveryBoyAddressController.deliveryBoyAddress)
router.get('/getDeliveryBoyAddresses', deliveryBoyAddressController.getAllDeliveryBoyAddresses);
router.put('/updateDeliveryBoyAddress',upload.single('image'),isAuthenticated, deliveryBoyAddressController.updateDeliveryBoyAddress);

module.exports = router;
