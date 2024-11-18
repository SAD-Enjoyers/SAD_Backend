const express = require('express');
const { addQuestion, scoreSubmission, getQuestion } = require('../controllers/question');
const { authenticateToken } = require('../middleware');

const questionRoutes = express.Router();

questionRoutes.post('/add-question', authenticateToken , addQuestion);
questionRoutes.put('/score-submission', authenticateToken, scoreSubmission);
questionRoutes.get('/get-question', getQuestion); // specific auth

module.exports = questionRoutes;
