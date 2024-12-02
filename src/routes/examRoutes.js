const express = require('express');
const { makeExam, preview, editExam, examPage, 
	privateQuestions, addQuestion, } = require('../controllers/exam');
const { authenticateToken, partialAccess } = require('../middleware');

const examRoutes = express.Router();

examRoutes.post('/make-exam', authenticateToken , makeExam);
examRoutes.get('/preview', partialAccess, preview);
examRoutes.put('/edit-exam', authenticateToken, editExam);
examRoutes.get('/:serviceId', authenticateToken, examPage);
examRoutes.get('/questions/:serviceId', authenticateToken, privateQuestions);
examRoutes.post('/add-question/', authenticateToken, addQuestion);
module.exports = examRoutes;
