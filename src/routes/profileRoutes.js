const express = require('express');
const { getPrivateProfile, examList, editProfile, articleList, profiles, publicProfile,
	withdraw, deposit, transactions, wallet, cardNumber, courseList,
	publicExam, publicArticle, publicCourse, } = require('../controllers/profile');
const { uploadFile } = require('../controllers/commonController');
const { authenticateToken, partialAccess, profileImageUploader } = require('../middleware');

const profileRoutes = express.Router();

profileRoutes.get('/private-data', authenticateToken , getPrivateProfile);
profileRoutes.get('/exam-list', authenticateToken, examList);
profileRoutes.get('/article-list', authenticateToken, articleList);
profileRoutes.put('/edit-profile', authenticateToken, editProfile);
profileRoutes.post('/upload-image', authenticateToken, profileImageUploader, uploadFile );
profileRoutes.post('/cardNumber', authenticateToken, cardNumber);
profileRoutes.get('/wallet', authenticateToken, wallet);
profileRoutes.get('/transactions', authenticateToken, transactions);
profileRoutes.post('/deposit', authenticateToken, deposit);
profileRoutes.post('/withdraw', authenticateToken, withdraw);
profileRoutes.get('/course-list', authenticateToken, courseList);
profileRoutes.get('/public-profile/:userId', partialAccess, publicProfile);
profileRoutes.get('/', partialAccess, profiles);
profileRoutes.get('/public-exam/:userId', partialAccess, publicExam);
profileRoutes.get('/public-article/:userId', partialAccess, publicArticle);
profileRoutes.get('/public-course/:userId', partialAccess, publicCourse);
// profile data

module.exports = profileRoutes;
