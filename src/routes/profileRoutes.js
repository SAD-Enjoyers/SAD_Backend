const express = require('express');
const { getPrivateProfile, examList, editProfile } = require('../controllers/profile');
const { uploadImage } = require('../controllers/commonController');
const { authenticateToken, partialAccess, profileImageUploader } = require('../middleware');

const profileRoutes = express.Router();

profileRoutes.get('/private-data', authenticateToken , getPrivateProfile);
profileRoutes.get('/exam-list', authenticateToken, examList);
profileRoutes.put('/edit-profile', authenticateToken, editProfile);
profileRoutes.post('/upload-image', authenticateToken, profileImageUploader, uploadImage );
// profile data

module.exports = profileRoutes;
