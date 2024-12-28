const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const questionRoutes = require('./questionRoutes');
const commonRoutes = require('./commonRoutes');
const examRoutes = require('./examRoutes');
const educationalServiceRoutes = require('./educationalServiceRoutes');
const articleRoutes = require('./articleRoutes');
const courseRoutes = require('./courseRoutes');

const router = express.Router();

router.use('/auth/', authRoutes);
router.use('/profile/', profileRoutes);
router.use('/questions/', questionRoutes);
router.use('/common/', commonRoutes);
router.use('/educational-service/', educationalServiceRoutes);
router.use('/exam/', examRoutes);
router.use('/article/', articleRoutes);
router.use('/course/', courseRoutes);

module.exports = router;
