const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// setting headers
// midlware param

router.post('/auth/signup', controller.signupUser);

module.exports = router;
