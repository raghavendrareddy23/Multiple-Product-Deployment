// wishListRoutes.js
const express = require('express');
const router = express.Router();
const wishListController = require('../eCommerceControllers/wishListController');
const {isAuthenticated} = require('../eCommerceUtils/auth');

router.post('/:id',isAuthenticated, wishListController.addToWishList);
router.get('/:userId', isAuthenticated, wishListController.getWishList);
router.delete('/:userId/:productId', isAuthenticated, wishListController.removeFromWishList);

module.exports = router;
