const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// setting headers
// midlware param

router.post('/auth/signup', controller.signupUser);
router.post('/auth/login', controller.login);
router.post('/auth/forgotPassword', controller.forgotPassword);

module.exports = router;
