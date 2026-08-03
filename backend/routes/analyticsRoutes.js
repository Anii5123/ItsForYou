const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const {
  startSession,
  sendHeartbeat,
  logPageVisit,
  syncStep,
  logTimelineEvent,
  logGalleryEvent,
  logVoiceEvent,
  logPoemEvent,
  submitFeedback,
  getPageAnalytics,
  getLiveStatus
} = require('../controllers/analyticsController');

// Public Telemetry Ingestion (Scoped by randomId)
router.post('/f/:randomId/session', startSession);
router.post('/f/:randomId/heartbeat', sendHeartbeat);
router.post('/f/:randomId/page-visit', logPageVisit);
router.post('/f/:randomId/step', syncStep);
router.post('/f/:randomId/timeline-event', logTimelineEvent);
router.post('/f/:randomId/gallery-event', logGalleryEvent);
router.post('/f/:randomId/voice-event', logVoiceEvent);
router.post('/f/:randomId/poem-event', logPoemEvent);
router.post('/f/:randomId/feedback', submitFeedback);

// Protected Admin Analytics & Real-Time Monitoring
router.get('/admin/pages/:id/analytics', protectAdmin, getPageAnalytics);
router.get('/admin/pages/:id/live', protectAdmin, getLiveStatus);

module.exports = router;
