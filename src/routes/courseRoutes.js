const express = require('express');
const { addCourse, courses, preview, addVideo, editVideo, deleteVideo,
	reorderVideo, editCourse, Participants, } = require('../controllers/course');
const { authenticateToken, partialAccess } = require('../middleware');

const courseRoutes = express.Router();

courseRoutes.post('/make-course', authenticateToken , addCourse);
courseRoutes.post('/add-video', authenticateToken, addVideo);
courseRoutes.get('/preview/:serviceId', partialAccess, preview);
courseRoutes.get('/', partialAccess, courses);
courseRoutes.put('/edit-video', authenticateToken, editVideo);
courseRoutes.delete('/delete-video', authenticateToken, deleteVideo);
courseRoutes.put('/reorder-video', authenticateToken, reorderVideo);
courseRoutes.put('/edit-course', authenticateToken, editCourse);
courseRoutes.get('/participants/:serviceId', authenticateToken, Participants);

module.exports = courseRoutes;
