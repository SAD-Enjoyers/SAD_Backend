const express = require('express');
const { whichPage, registerService, comments, addComment, scoreSubmission } = require('../controllers/educationalService');
const { authenticateToken, partialAccess, serviceImageUploader, 
	articleAttachmentUploader, courseVideoUploader } = require('../middleware');
const { uploadFile } = require('../controllers/commonController');

const educationalServiceRoutes = express.Router();

educationalServiceRoutes.post('/upload-image'
	, authenticateToken, serviceImageUploader, uploadFile);
educationalServiceRoutes.post('/upload-attachment'
	, authenticateToken, articleAttachmentUploader, uploadFile);
educationalServiceRoutes.post('/upload-video'
	, authenticateToken, courseVideoUploader, uploadFile);

educationalServiceRoutes.get('/which-page/', authenticateToken, whichPage);
educationalServiceRoutes.post('/register/', authenticateToken, registerService);
educationalServiceRoutes.get('/comments/:serviceId', comments);
educationalServiceRoutes.post('/add-comment/', authenticateToken, addComment);
educationalServiceRoutes.put('/score-submission', authenticateToken, scoreSubmission);

module.exports = educationalServiceRoutes;
