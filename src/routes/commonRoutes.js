const express = require('express');
const { categories, registerTicket } = require('../controllers/commonController');
const { authenticateToken } = require('../middleware');

const commonRoutes = express.Router();

commonRoutes.get('/categories', categories);
commonRoutes.post('/register-ticket', authenticateToken, registerTicket);

module.exports = commonRoutes;
