const FriendPage = require('../models/FriendPage');
const VisitSession = require('../models/VisitSession');

// Helper to generate secure nanoid (8 chars, URL safe)
const generateNanoid = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @desc    Get all friend pages (Admin)
// @route   GET /api/admin/pages
// @access  Private
const getPages = async (req, res) => {
  try {
    const pages = await FriendPage.find({}).sort({ updatedAt: -1 }).lean();

    // Attach quick visit stats per page card
    const pagesWithStats = await Promise.all(
      pages.map(async (page) => {
        const totalVisits = await VisitSession.countDocuments({ friendPageId: page._id });
        const completedVisits = await VisitSession.countDocuments({ friendPageId: page._id, completed: true });
        const completionRate = totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 100) : 0;
        return {
          ...page,
          stats: {
            totalVisits,
            completedVisits,
            completionRate
          }
        };
      })
    );

    res.json(pagesWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new FriendPage (Admin)
// @route   POST /api/admin/pages
// @access  Private
const createPage = async (req, res) => {
  try {
    const { friendName, friendSlug } = req.body;
    
    if (!friendName) {
      return res.status(400).json({ message: 'Friend name is required' });
    }

    let slug = (friendSlug || friendName).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    if (!slug || slug === '-') slug = 'friend';

    let randomId = generateNanoid(8);
    let existing = await FriendPage.findOne({ randomId });
    while (existing) {
      randomId = generateNanoid(8);
      existing = await FriendPage.findOne({ randomId });
    }

    const newPage = await FriendPage.create({
      randomId,
      friendSlug: slug,
      friendName,
      status: 'draft',
      heroMessage: `To my amazing friend ${friendName}, here is our story!`,
      friendshipDayMessage: `Happy Friendship Day, ${friendName}! Thank you for being such an irreplaceable part of my life.`
    });

    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single FriendPage by ID (Admin)
// @route   GET /api/admin/pages/:id
// @access  Private
const getPageById = async (req, res) => {
  try {
    const page = await FriendPage.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Friend page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update FriendPage (Admin)
// @route   PUT /api/admin/pages/:id
// @access  Private
const updatePage = async (req, res) => {
  try {
    const page = await FriendPage.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Friend page not found' });
    }

    const fieldsToUpdate = [
      'friendSlug', 'friendName', 'status', 'theme', 'themeName', 'backgroundMusicUrl',
      'heroMessage', 'friendshipDayMessage', 'timelineEvents', 'galleryImages', 'galleryFallbackMessage',
      'voiceNoteUrl', 'poemStanzas', 'surpriseGiftContent', 'endingMessage', 'currentStep'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        page[field] = req.body[field];
      }
    });

    if (req.body.status === 'published' && !page.publishedAt) {
      page.publishedAt = new Date();
    }

    const updatedPage = await page.save();
    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Duplicate FriendPage (Admin)
// @route   POST /api/admin/pages/:id/duplicate
// @access  Private
const duplicatePage = async (req, res) => {
  try {
    const original = await FriendPage.findById(req.params.id).lean();
    if (!original) {
      return res.status(404).json({ message: 'Original page not found' });
    }

    delete original._id;
    delete original.createdAt;
    delete original.updatedAt;

    let randomId = generateNanoid(8);
    let existing = await FriendPage.findOne({ randomId });
    while (existing) {
      randomId = generateNanoid(8);
      existing = await FriendPage.findOne({ randomId });
    }

    original.randomId = randomId;
    original.friendName = `${original.friendName} (Copy)`;
    original.friendSlug = `${original.friendSlug}-copy`;
    original.status = 'draft';

    const clonedPage = await FriendPage.create(original);
    res.status(201).json(clonedPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete FriendPage (Admin)
// @route   DELETE /api/admin/pages/:id
// @access  Private
const deletePage = async (req, res) => {
  try {
    const page = await FriendPage.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    await page.deleteOne();
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Publish / Unpublish toggle (Admin)
// @route   POST /api/admin/pages/:id/publish
// @access  Private
const togglePublish = async (req, res) => {
  try {
    const page = await FriendPage.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    page.status = page.status === 'published' ? 'draft' : 'published';
    if (page.status === 'published') {
      page.publishedAt = new Date();
    }

    await page.save();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Public Friend Page verification & load (Friend-Facing)
// @route   GET /api/f/:randomId/:friendSlug
// @access  Public
const getPublicPage = async (req, res) => {
  try {
    const { randomId, friendSlug } = req.params;

    // Strict validation: randomId AND friendSlug must match together exactly
    const page = await FriendPage.findOne({
      randomId: randomId.trim(),
      friendSlug: friendSlug.trim().toLowerCase()
    }).select('-__v');

    // Never reveal whether randomId or friendSlug was incorrect
    if (!page) {
      return res.status(404).json({ message: 'Gift experience not found' });
    }

    // Allow viewing draft pages if requested via admin preview flag, else enforce published status
    const isPreview = req.query.preview === 'true';
    if (page.status !== 'published' && !isPreview) {
      return res.status(404).json({ message: 'Gift experience not found' });
    }

    res.json(page);
  } catch (error) {
    // Standard 404 response to avoid leaking database errors
    res.status(404).json({ message: 'Gift experience not found' });
  }
};

module.exports = {
  getPages,
  createPage,
  getPageById,
  updatePage,
  duplicatePage,
  deletePage,
  togglePublish,
  getPublicPage
};
