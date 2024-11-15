const express = require('express');
const { getPrivateProfile } = require('../controllers/privateProfile');
const { authenticateToken } = require('../middleware');

const profileRoutes = express.Router();

profileRoutes.get('/private-data', authenticateToken , getPrivateProfile);
// profile data


module.exports = profileRoutes;
