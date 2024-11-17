const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const questionRoutes = require('./questionRoutes');

const router = express.Router();

router.use('/auth/', authRoutes);
router.use('/profile/', profileRoutes);
router.use('/questions/', questionRoutes);

module.exports = router;
