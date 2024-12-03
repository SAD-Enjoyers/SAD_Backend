const express = require('express');
const { makeExam, preview, editExam, exams } = require('../controllers/exam');
const { authenticateToken, partialAccess } = require('../middleware');

const examRoutes = express.Router();

examRoutes.post('/make-exam', authenticateToken , makeExam);
examRoutes.get('/preview', partialAccess, preview);
examRoutes.put('/edit-exam', authenticateToken, editExam);
examRoutes.get('/', partialAccess, exams);

module.exports = examRoutes;