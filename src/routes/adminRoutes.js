const express = require('express');
const { editExpert, newTicket, searchTicket, updateTicket, } = require('../controllers/admin');
const { getPrivateProfile } = require('../controllers/profile');
const { authenticateToken, partialAccess } = require('../middleware');

const adminRoutes = express.Router();

adminRoutes.post('/edit-admin', authenticateToken , editExpert);
adminRoutes.get('/profile', authenticateToken, getPrivateProfile);
adminRoutes.get('/tickets', authenticateToken, newTicket)
adminRoutes.get('/search-tickets', authenticateToken, searchTicket);
adminRoutes.put('/update-ticket', authenticateToken, updateTicket); // better to use patch

module.exports = adminRoutes;
