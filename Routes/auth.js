
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth');

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOTP);



module.exports = router;
