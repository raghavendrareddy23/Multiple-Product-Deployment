// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const socketController = require('../eCommerceControllers/socketController');


router.get('/initial', socketController.getInitialNotifications);
router.put('/:id', socketController.updateNotificationStatus);

module.exports = router;
