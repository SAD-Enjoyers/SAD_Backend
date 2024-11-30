const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const questionRoutes = require('./questionRoutes');
const commonRoutes = require('./commonRoutes');
const examRoutes = require('./examRoutes');
const educationalServiceRoutes = require('./educationalServiceRoutes');

const router = express.Router();

router.use('/auth/', authRoutes);
router.use('/profile/', profileRoutes);
router.use('/questions/', questionRoutes);
router.use('/common/', commonRoutes);
router.use('/exam/', examRoutes);
router.use('/educational-service/', educationalServiceRoutes);

module.exports = router;
