const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// setting headers
// midlware param

router.post('/auth/signup', controller.signupUser);
router.post('/auth/login', controller.login);
router.post('/auth/sendMail', controller.sendForgotMail);
router.put('/auth/verify-recovery-code', controller.verifyRecoveryCode);
router.get('/auth/verify-email', controller.verifyEmail);

module.exports = router;
