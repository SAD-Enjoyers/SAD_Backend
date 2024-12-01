const express = require('express');
const { makeExam, editExam } = require('../controllers/exam');
const { authenticateToken, partialAccess } = require('../middleware');

const examRoutes = express.Router();

examRoutes.post('/make-exam', authenticateToken , makeExam);
examRoutes.put('/edit-exam', authenticateToken, editExam);

module.exports = examRoutes;