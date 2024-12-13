const express = require('express');
const { whichPage, tempRegister, comments, addComment } = require('../controllers/educationalService');
const { authenticateToken, partialAccess, serviceImageUploader } = require('../middleware');
const { uploadImage } = require('../controllers/commonController');

const educationalServiceRoutes = express.Router();

educationalServiceRoutes.post('/upload-image'
	, authenticateToken, serviceImageUploader, uploadImage);

educationalServiceRoutes.get('/which-page/', authenticateToken, whichPage);
educationalServiceRoutes.post('/register/', authenticateToken, tempRegister);
educationalServiceRoutes.get('/comments/:serviceId', comments);
educationalServiceRoutes.post('/add-comment/', authenticateToken, addComment);

module.exports = educationalServiceRoutes;
