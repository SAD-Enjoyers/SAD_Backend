const express = require('express');
const { uploadImage } = require('../controllers/educationalService');
const { authenticateToken, partialAccess, serviceImageUploader } = require('../middleware');

const educationalServiceRoutes = express.Router();

educationalServiceRoutes.post('/upload-image'
	, authenticateToken, serviceImageUploader, uploadImage);

module.exports = educationalServiceRoutes;
