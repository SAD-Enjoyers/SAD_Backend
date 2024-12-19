const express = require('express');
const { getPrivateProfile, examList, editProfile, articleList } = require('../controllers/profile');
const { uploadFile } = require('../controllers/commonController');
const { authenticateToken, partialAccess, profileImageUploader } = require('../middleware');

const profileRoutes = express.Router();

profileRoutes.get('/private-data', authenticateToken , getPrivateProfile);
profileRoutes.get('/exam-list', authenticateToken, examList);
profileRoutes.get('/article-list', authenticateToken, articleList);
profileRoutes.put('/edit-profile', authenticateToken, editProfile);
profileRoutes.post('/upload-image', authenticateToken, profileImageUploader, uploadFile );
// profile data

module.exports = profileRoutes;
