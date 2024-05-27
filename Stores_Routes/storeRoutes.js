const express = require('express');
const router = express.Router();
const {createStore, getStores} = require('../StoresController/storeController');
const {isAuthenticated} = require("../eCommerceUtils/auth")

router.post('/create', isAuthenticated, createStore);
router.get('/get', isAuthenticated, getStores);

module.exports = router;
