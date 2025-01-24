const express = require('express');
const { editExpert, newTicket, searchTicket, updateTicket, changeServiceState, 
	getUserSession, newAdmin, serviceStatistics, ticketStatistics } = require('../controllers/admin');
const { getPrivateProfile } = require('../controllers/profile');
const { authenticateToken, partialAccess } = require('../middleware');

const adminRoutes = express.Router();

adminRoutes.post('/edit-admin', authenticateToken , editExpert);
adminRoutes.get('/profile', authenticateToken, getPrivateProfile);
adminRoutes.post('/new-admin', authenticateToken, newAdmin);
adminRoutes.get('/tickets', authenticateToken, newTicket)
adminRoutes.get('/search-tickets', authenticateToken, searchTicket);
adminRoutes.put('/update-ticket', authenticateToken, updateTicket); // better to use patch
adminRoutes.put('/change-service-state', authenticateToken, changeServiceState);
adminRoutes.post('/get-user-session', authenticateToken, getUserSession);
adminRoutes.get('/service-statistics', authenticateToken, serviceStatistics);
adminRoutes.get('/ticket-statistics', authenticateToken, ticketStatistics);

module.exports = adminRoutes;
