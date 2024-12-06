const express = require('express');
const { getPrivateProfile, examList } = require('../controllers/privateProfile');
const { authenticateToken } = require('../middleware');

const profileRoutes = express.Router();

profileRoutes.get('/private-data', authenticateToken , getPrivateProfile);
profileRoutes.get('/exam-list', authenticateToken, examList);
// profile data

module.exports = profileRoutes;
