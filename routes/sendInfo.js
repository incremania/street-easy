const express = require('express');
const router = express.Router();
const { sendEmail, sendCode } = require('../controller/sendInfo') 

router
.post('/send-email', sendEmail)
.patch('/send-code', sendCode)


module.exports = router