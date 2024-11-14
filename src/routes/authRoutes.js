const express = require('express');
const auth = require('../controllers/auth');

const authRoutes = express.Router();

authRoutes.post('/signup', auth.signupUser);
authRoutes.post('/login', auth.login);
authRoutes.post('/sendMail', auth.sendForgotMail);
authRoutes.put('/verify-recovery-code', auth.verifyRecoveryCode);
authRoutes.get('/verify-email', auth.verifyEmail);

module.exports = authRoutes;
