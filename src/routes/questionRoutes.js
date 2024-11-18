const express = require('express');
const { addQuestion, scoreSubmission } = require('../controllers/question');
const { authenticateToken } = require('../middleware');

const questionRoutes = express.Router();

questionRoutes.post('/add-question', authenticateToken , addQuestion);
questionRoutes.put('/score-submission', authenticateToken, scoreSubmission);

module.exports = questionRoutes;
