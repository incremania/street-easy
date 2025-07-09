const express = require('express')
const router = express.Router();
const { sendDetails } = require('../controller/zillow')

router.post('/send-details-zillow', sendDetails)

module.exports = router