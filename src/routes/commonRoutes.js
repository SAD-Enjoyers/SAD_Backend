const express = require('express');
const { categories } = require('../controllers/commonController');
const { authenticateToken } = require('../middleware');

const commonRoutes = express.Router();

commonRoutes.get('/categories', categories);

module.exports = commonRoutes;
