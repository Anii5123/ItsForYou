const express = require('express');
const router = express.Router();
const { getPublicPage } = require('../controllers/pageController');

// Public route for loading validated friend page content
router.get('/f/:randomId/:friendSlug', getPublicPage);

module.exports = router;
