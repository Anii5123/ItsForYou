const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const { getUploadSignature } = require('../controllers/uploadController');

router.post('/upload-signature', protectAdmin, getUploadSignature);

module.exports = router;
