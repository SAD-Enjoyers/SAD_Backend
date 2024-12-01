const express = require('express');
const { makeExam, preview } = require('../controllers/exam');
const { authenticateToken, partialAccess } = require('../middleware');

const examRoutes = express.Router();

examRoutes.post('/make-exam', authenticateToken , makeExam);
examRoutes.get('/preview', partialAccess, preview);

module.exports = examRoutes;