const express = require('express');
const { addCourse, courses, preview, addVideo, editVideo, deleteVideo } = require('../controllers/course');
const { authenticateToken, partialAccess } = require('../middleware');

const courseRoutes = express.Router();

courseRoutes.post('/make-course', authenticateToken , addCourse);
courseRoutes.post('/add-video', authenticateToken, addVideo);
courseRoutes.get('/preview/:serviceId', partialAccess, preview);
courseRoutes.get('/', partialAccess, courses);
courseRoutes.put('/edit-video', authenticateToken, editVideo);
courseRoutes.delete('/delete-video', authenticateToken, deleteVideo);

module.exports = courseRoutes;
