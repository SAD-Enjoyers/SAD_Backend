const express = require('express');
const { makeExam, preview, editExam, examPage, exams, startExam, endExam, examResult, 
	privateQuestions, addQuestion, deleteQuestion, reorderQuestions } = require('../controllers/exam');
const { authenticateToken, partialAccess } = require('../middleware');

const examRoutes = express.Router();

examRoutes.post('/make-exam', authenticateToken , makeExam);
examRoutes.get('/preview', partialAccess, preview);
examRoutes.put('/edit-exam', authenticateToken, editExam);
examRoutes.get('/:serviceId', authenticateToken, examPage);
examRoutes.get('/questions/:serviceId', authenticateToken, privateQuestions);
examRoutes.post('/add-question/', authenticateToken, addQuestion);
examRoutes.delete('/delete-question/', authenticateToken, deleteQuestion);
examRoutes.put('/reorder-questions/', authenticateToken, reorderQuestions);
examRoutes.get('/', partialAccess, exams);
examRoutes.get('/start-exam/:serviceId', authenticateToken, startExam);
examRoutes.post('/end-exam/', authenticateToken, endExam);
examRoutes.get('/exam-result/:serviceId', authenticateToken, examResult);

module.exports = examRoutes;
