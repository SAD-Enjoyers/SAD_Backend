const express = require('express');
const { uploadImage, whichPage } = require('../controllers/educationalService');
const { authenticateToken, partialAccess, serviceImageUploader } = require('../middleware');

const educationalServiceRoutes = express.Router();

educationalServiceRoutes.post('/upload-image'
	, authenticateToken, serviceImageUploader, uploadImage);

educationalServiceRoutes.get('/which-page/', authenticateToken, whichPage);

module.exports = educationalServiceRoutes;
