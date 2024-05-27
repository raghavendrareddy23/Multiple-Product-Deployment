const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../eCommerceUtils/auth');
const {
    addCartItem,
    getCartItems,
    updateCartItem,
    deleteCartItemById,
    deleteAllCartItems,
} = require('../eCommerceControllers/cartItemController');

router.get('/:id', isAuthenticated, getCartItems);
router.post('/:id', isAuthenticated, addCartItem);
router.put('/:id', isAuthenticated, updateCartItem);
router.delete('/:userId', isAuthenticated, deleteAllCartItems);
router.delete('/:userId/:itemId',isAuthenticated, deleteCartItemById);

module.exports = router;
