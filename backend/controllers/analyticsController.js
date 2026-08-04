const FriendPage = require('../models/FriendPage');
const VisitSession = require('../models/VisitSession');
const PageVisit = require('../models/PageVisit');
const TimelineEventView = require('../models/TimelineEventView');
const GalleryEvent = require('../models/GalleryEvent');
const VoiceNoteEvent = require('../models/VoiceNoteEvent');
const PoemEvent = require('../models/PoemEvent');
const FeedbackResponse = require('../models/FeedbackResponse');
const sendEmail = require('../config/mailer');

// Helper to determine rough device type from user agent
const parseDeviceType = (userAgent = '') => {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    return /ipad|tablet/i.test(ua) ? 'tablet' : 'mobile';
  }
  return 'desktop';
};

// @desc    Start or resume a visitor session
// @route   POST /api/f/:randomId/session
// @access  Public
const startSession = async (req, res) => {
  try {
    const { randomId } = req.params;
    const { sessionId, userAgent, visitorName, visitorEmail } = req.body;

    const page = await FriendPage.findOne({ randomId });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    let session = await VisitSession.findOne({ friendPageId: page._id, sessionId });

    if (!session) {
      session = await VisitSession.create({
        friendPageId: page._id,
        sessionId,
        isFirstVisit: true,
        startedAt: new Date(),
        lastActivityAt: new Date(),
        visitorName: visitorName || '',
        visitorEmail: visitorEmail || '',
        deviceInfo: {
          userAgent: userAgent || '',
          deviceType: parseDeviceType(userAgent)
        }
      });
    } else {
      session.isFirstVisit = false;
      session.lastActivityAt = new Date();
      if (visitorName) session.visitorName = visitorName;
      if (visitorEmail) session.visitorEmail = visitorEmail;
      await session.save();
    }

    res.json({ sessionId: session.sessionId, friendPageId: page._id, visitorName: session.visitorName, visitorEmail: session.visitorEmail });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Session Heartbeat pulse for live monitoring
// @route   POST /api/f/:randomId/heartbeat
// @access  Public
const sendHeartbeat = async (req, res) => {
  try {
    const { randomId } = req.params;
    const { sessionId, currentStep, durationSeconds, completed } = req.body;

    const page = await FriendPage.findOne({ randomId });
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const session = await VisitSession.findOne({ friendPageId: page._id, sessionId });
    if (session) {
      session.lastActivityAt = new Date();
      if (durationSeconds) session.totalTimeSeconds = durationSeconds;
      if (completed !== undefined) session.completed = completed;
      await session.save();
    }

    res.json({ status: 'active' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log per-page visit telemetry
// @route   POST /api/f/:randomId/page-visit
// @access  Public
const logPageVisit = async (req, res) => {
  try {
    const { randomId } = req.params;
    const { sessionId, pageKey, durationSeconds, maxScrollPercent, skipped, completed } = req.body;

    const page = await FriendPage.findOne({ randomId });
    if (!page) return res.status(404).json({ message: 'Page not found' });

    await PageVisit.create({
      friendPageId: page._id,
      sessionId,
      pageKey,
      durationSeconds: durationSeconds || 0,
      maxScrollPercent: maxScrollPercent || 0,
      skipped: !!skipped,
      completed: !!completed
    });

    res.json({ status: 'logged' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync server-authoritative current step per visitor session
// @route   POST /api/f/:randomId/step
// @access  Public
const syncStep = async (req, res) => {
  try {
    const { randomId } = req.params;
    const { sessionId, currentStep } = req.body;

    const page = await FriendPage.findOne({ randomId });
    if (!page) return res.status(404).json({ message: 'Page not found' });

    let updatedStep = 1;
    if (sessionId && currentStep) {
      const session = await VisitSession.findOne({ friendPageId: page._id, sessionId });
      if (session) {
        session.currentStep = Math.max(session.currentStep || 1, currentStep);
        session.lastActivityAt = new Date();
        await session.save();
        updatedStep = session.currentStep;
      }
    }

    res.json({ currentStep: updatedStep });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log timeline event view
// @route   POST /api/f/:randomId/timeline-event
// @access  Public
const logTimelineEvent = async (req, res) => {
  try {
    const { randomId } = req.params;
    const { sessionId, eventIndex, durationSeconds, skipped } = req.body;

    const page = await FriendPage.findOne({ randomId });
    if (page) {
      await TimelineEventView.create({
        friendPageId: page._id,
        sessionId,
        eventIndex,
        durationSeconds: durationSeconds || 0,
        skipped: !!skipped
      });
    }
    res.json({ status: 'logged' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log gallery image open event
// @route   POST /api/f/:randomId/gallery-event
// @access  Public
const logGalleryEvent = async (req, res) => {
  try {
    const { randomId } = req.params;
    const { sessionId, imageIndex, durationSeconds } = req.body;

    const page = await FriendPage.findOne({ randomId });
    if (page) {
      await GalleryEvent.create({
        friendPageId: page._id,
        sessionId,
        imageIndex,
        durationSeconds: durationSeconds || 0
      });
    }
    res.json({ status: 'logged' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log voice note event
// @route   POST /api/f/:randomId/voice-event
// @access  Public
const logVoiceEvent = async (req, res) => {
  try {
    const { randomId } = req.params;
    const { sessionId, played, paused, completed, percentListened, replayCount } = req.body;

    const page = await FriendPage.findOne({ randomId });
    if (page) {
      await VoiceNoteEvent.create({
        friendPageId: page._id,
        sessionId,
        played: !!played,
        paused: !!paused,
        completed: !!completed,
        percentListened: percentListened || 0,
        replayCount: replayCount || 0
      });
    }
    res.json({ status: 'logged' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log poem reading event
// @route   POST /api/f/:randomId/poem-event
// @access  Public
const logPoemEvent = async (req, res) => {
  try {
    const { randomId } = req.params;
    const { sessionId, readDurationSeconds, completed } = req.body;

    const page = await FriendPage.findOne({ randomId });
    if (page) {
      await PoemEvent.create({
        friendPageId: page._id,
        sessionId,
        readDurationSeconds: readDurationSeconds || 0,
        completed: !!completed
      });
    }
    res.json({ status: 'logged' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit feedback & reflection answers
// @route   POST /api/f/:randomId/feedback
// @access  Public
const submitFeedback = async (req, res) => {
  try {
    const { randomId } = req.params;
    const { sessionId, visitorName, visitorEmail, likedGift, likedMostText, didntLikeText, reflectionAnswers } = req.body;

    const page = await FriendPage.findOne({ randomId });
    if (!page) return res.status(404).json({ message: 'Page not found' });

    // Look up visitor details from VisitSession if not directly in body
    let finalName = visitorName || '';
    let finalEmail = visitorEmail || '';
    if (!finalName || !finalEmail) {
      const session = await VisitSession.findOne({ friendPageId: page._id, sessionId });
      if (session) {
        if (!finalName) finalName = session.visitorName || '';
        if (!finalEmail) finalEmail = session.visitorEmail || '';
      }
    }

    const feedback = await FeedbackResponse.create({
      friendPageId: page._id,
      sessionId,
      visitorName: finalName,
      visitorEmail: finalEmail,
      likedGift: likedGift !== undefined ? likedGift : true,
      likedMostText: likedMostText || '',
      didntLikeText: didntLikeText || '',
      reflectionAnswers: reflectionAnswers || {}
    });

    // Mark VisitSession as completed
    await VisitSession.updateOne({ friendPageId: page._id, sessionId }, {
      completed: true,
      visitorName: finalName,
      visitorEmail: finalEmail
    });

    // Send email alert to Admin via SMTP
    sendEmail({
      to: process.env.SMTP_USER || 'aniip5122003@gmail.com',
      subject: `❤️ ${finalName || page.friendName} Completed Their Friendship Experience!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;">
          <h2 style="color: #fb7185;">Great News! ${finalName || page.friendName} (${finalEmail || 'No email'}) Just Finished Their Journey</h2>
          <p><strong>Visitor:</strong> ${finalName || 'Guest'} (${finalEmail || 'No email'})</p>
          <p><strong>Liked Experience:</strong> ${likedGift ? 'Yes, Loved It! ❤️' : 'Could be better'}</p>
          <p><strong>Favourite Moment:</strong> ${likedMostText || 'N/A'}</p>
          <hr style="border-color: #334155;" />
          <h3>Reflection Answers:</h3>
          <ul>
            <li><strong>What am I to you?</strong> ${reflectionAnswers?.whatAmIToYou || 'N/A'}</li>
            <li><strong>Describe our friendship:</strong> ${reflectionAnswers?.describeOurFriendship || 'N/A'}</li>
            <li><strong>Favourite memory:</strong> ${reflectionAnswers?.favouriteMemory || 'N/A'}</li>
            <li><strong>Anything else:</strong> ${reflectionAnswers?.anythingElse || 'N/A'}</li>
            ${reflectionAnswers?.friendVoiceNoteUrl ? `<li><strong>Voice Note Reply:</strong> <a href="${reflectionAnswers.friendVoiceNoteUrl}" style="color: #fb7185;">Listen to Voice Note</a></li>` : ''}
          </ul>
          <p style="color: #94a3b8; font-size: 12px;">Sent via For You App SMTP Service</p>
        </div>
      `
    });

    res.json({ status: 'submitted', feedbackId: feedback._id });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get aggregated page analytics (Admin)
// @route   GET /api/admin/pages/:id/analytics
// @access  Private
const getPageAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await FriendPage.findById(id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const sessions = await VisitSession.find({ friendPageId: id }).sort({ startedAt: -1 });
    const totalVisits = sessions.length;
    const completedVisits = sessions.filter(s => s.completed).length;
    const completionRate = totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 100) : 0;

    const totalDuration = sessions.reduce((acc, s) => acc + (s.totalTimeSeconds || 0), 0);
    const avgSessionSeconds = totalVisits > 0 ? Math.round(totalDuration / totalVisits) : 0;

    const bounceVisits = sessions.filter(s => (s.totalTimeSeconds || 0) < 10).length;
    const bounceRate = totalVisits > 0 ? Math.round((bounceVisits / totalVisits) * 100) : 0;

    // Detailed per-visitor sessions list with duration & device breakdown
    const visitorSessions = await Promise.all(
      sessions.map(async (s) => {
        const visits = await PageVisit.find({ friendPageId: id, sessionId: s.sessionId }).sort({ createdAt: 1 });
        return {
          sessionId: s.sessionId,
          visitorName: s.visitorName || '',
          visitorEmail: s.visitorEmail || '',
          deviceType: s.deviceInfo?.deviceType || 'unknown',
          userAgent: s.deviceInfo?.userAgent || '',
          startedAt: s.startedAt,
          lastActivityAt: s.lastActivityAt,
          totalTimeSeconds: s.totalTimeSeconds || 0,
          currentStep: s.currentStep || 1,
          completed: s.completed,
          isFirstVisit: s.isFirstVisit,
          pageVisitsCount: visits.length,
          stepBreakdown: visits.map(v => ({
            pageKey: v.pageKey,
            durationSeconds: v.durationSeconds
          }))
        };
      })
    );

    // Per-page dwell breakdown
    const pageVisits = await PageVisit.find({ friendPageId: id });
    const pageKeys = ['welcome', 'greeting', 'prompt', 'timeline', 'gallery', 'voice', 'surprise', 'poem', 'feedback', 'reflection', 'ending'];
    
    const pageBreakdown = pageKeys.map(key => {
      const visits = pageVisits.filter(v => v.pageKey === key);
      const count = visits.length;
      const totalDwell = visits.reduce((acc, v) => acc + (v.durationSeconds || 0), 0);
      const avgDwell = count > 0 ? Math.round(totalDwell / count) : 0;
      return {
        pageKey: key,
        visitCount: count,
        avgDwellSeconds: avgDwell
      };
    });

    // Voice & Poem Stats
    const voiceEvents = await VoiceNoteEvent.find({ friendPageId: id });
    const totalVoiceListens = voiceEvents.length;
    const voiceCompletions = voiceEvents.filter(v => v.completed).length;

    const poemEvents = await PoemEvent.find({ friendPageId: id });
    const totalPoemReads = poemEvents.length;

    // Feedback & Reflections
    const feedbackList = await FeedbackResponse.find({ friendPageId: id }).sort({ createdAt: -1 });

    res.json({
      summary: {
        totalVisits,
        completedVisits,
        completionRate,
        avgSessionSeconds,
        bounceRate
      },
      visitorSessions,
      pageBreakdown,
      voiceStats: {
        totalVoiceListens,
        voiceCompletions
      },
      poemStats: {
        totalPoemReads
      },
      feedbackList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get real-time live visitor status (Admin)
// @route   GET /api/admin/pages/:id/live
// @access  Private
const getLiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);

    const activeSessions = await VisitSession.find({
      friendPageId: id,
      lastActivityAt: { $gte: thirtySecondsAgo }
    }).sort({ lastActivityAt: -1 });

    res.json({
      isLive: activeSessions.length > 0,
      activeVisitorCount: activeSessions.length,
      activeSessions: activeSessions.map(s => ({
        sessionId: s.sessionId,
        deviceType: s.deviceInfo?.deviceType || 'unknown',
        totalTimeSeconds: s.totalTimeSeconds || 0,
        lastActivityAt: s.lastActivityAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
