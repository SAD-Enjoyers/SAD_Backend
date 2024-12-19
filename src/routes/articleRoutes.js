const express = require('express');
const { makeArticle, preview, articlePage, editArticle } = require('../controllers/article');
const { authenticateToken, partialAccess } = require('../middleware');

const articleRoutes = express.Router();

articleRoutes.post('/make-article', authenticateToken , makeArticle);
articleRoutes.get('/preview/:serviceId', partialAccess, preview);
articleRoutes.get('/:serviceId', authenticateToken, preview);
articleRoutes.post('/blog/:serviceId', authenticateToken, editArticle);
articleRoutes.get('/blog/:serviceId', authenticateToken, articlePage);

module.exports = articleRoutes;