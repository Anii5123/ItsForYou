const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const {
  getPages,
  createPage,
  getPageById,
  updatePage,
  duplicatePage,
  deletePage,
  togglePublish
} = require('../controllers/pageController');

router.use(protectAdmin);

router.route('/')
  .get(getPages)
  .post(createPage);

router.route('/:id')
  .get(getPageById)
  .put(updatePage)
  .delete(deletePage);

router.post('/:id/duplicate', duplicatePage);
router.post('/:id/publish', togglePublish);

module.exports = router;
