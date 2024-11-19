const express = require('express');
const { addQuestion, scoreSubmission, getQuestion, questions } = require('../controllers/question');
const { authenticateToken, partialAccess } = require('../middleware');

const questionRoutes = express.Router();

questionRoutes.post('/add-question', authenticateToken , addQuestion);
questionRoutes.put('/score-submission', authenticateToken, scoreSubmission);
questionRoutes.get('/get-question', partialAccess, getQuestion);
questionRoutes.get('/', partialAccess, questions);

module.exports = questionRoutes;
