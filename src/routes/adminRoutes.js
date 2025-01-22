const express = require('express');
const { editExpert, newTicket, searchTicket, } = require('../controllers/admin');
const { getPrivateProfile } = require('../controllers/profile');
const { authenticateToken, partialAccess } = require('../middleware');

const adminRoutes = express.Router();

adminRoutes.post('/edit-admin', authenticateToken , editExpert);
adminRoutes.get('/profile', authenticateToken, getPrivateProfile);
adminRoutes.get('/tickets', authenticateToken, newTicket)

module.exports = adminRoutes;
