const express = require('express');
const { addQuestion } = require('../controllers/question');
// const { authenticateToken } = require('../middleware');

const questionRoutes = express.Router();

questionRoutes.post('/add-question', addQuestion); // , authenticateToken 


module.exports = questionRoutes;
