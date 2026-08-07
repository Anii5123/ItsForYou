import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFriendStore } from '../../store/friendStore';
import { fetchPublicPage } from '../../api/pagesApi';
import {
  startSession,
  sendHeartbeat,
  logPageVisit,
  syncStepServer,
  submitFeedbackServer
} from '../../api/analyticsApi';
import { NotFoundPage } from '../NotFoundPage';
import { WelcomeStep } from '../../components/friend/WelcomeStep';
import { GreetingStep } from '../../components/friend/GreetingStep';
import { PromptStep } from '../../components/friend/PromptStep';
import { TimelineStep } from '../../components/friend/TimelineStep';
import { GalleryStep } from '../../components/friend/GalleryStep';
import { VoiceNoteStep } from '../../components/friend/VoiceNoteStep';
import { SurprisePromptStep } from '../../components/friend/SurprisePromptStep';
import { PoemStep } from '../../components/friend/PoemStep';
import { FeedbackStep } from '../../components/friend/FeedbackStep';
import { ReflectionStep } from '../../components/friend/ReflectionStep';
import { EndingStep } from '../../components/friend/EndingStep';
import { CuteMascots } from '../../components/friend/CuteMascots';
import { Volume2, VolumeX, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';

const STEP_KEYS = [
  'welcome', 'greeting', 'prompt', 'timeline', 'gallery',
  'voice', 'surprise', 'poem', 'feedback', 'reflection', 'ending'
];

export const FriendJourneyPage = () => {
  const { randomId, friendSlug } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const bgAudioRef = useRef(new Audio());
  const sessionStartTime = useRef(Date.now());
  const stepStartTime = useRef(Date.now());

  const {
    pageData,
    currentStep,
    sessionId,
    feedback,
    reflections,
    nextStep,
    prevStep,
    showWelcomeBack,
    dismissWelcomeBack,
    initPage
  } = useFriendStore();

  // 1. Initial Load & Session Start
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const data = await fetchPublicPage(randomId, friendSlug, isPreview);
        initPage(data, randomId, friendSlug);
        
        if (data.backgroundMusicUrl) {
          bgAudioRef.current.src = data.backgroundMusicUrl;
          bgAudioRef.current.loop = true;
        }

        // Telemetry: Start Session with Visitor Details
        if (!isPreview) {
          const state = useFriendStore.getState();
          await startSession(randomId, state.sessionId, state.visitorName, state.visitorEmail);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();

    return () => {
      bgAudioRef.current.pause();
    };
  }, [randomId, friendSlug, isPreview]);

  // 2. Periodic Heartbeat Timer (Every 10 seconds)
  useEffect(() => {
    if (loading || error || isPreview || !sessionId) return;

    const interval = setInterval(() => {
      const elapsedSeconds = Math.round((Date.now() - sessionStartTime.current) / 1000);
      const { visitorName, visitorEmail } = useFriendStore.getState();
      sendHeartbeat(randomId, sessionId, currentStep, elapsedSeconds, currentStep === 11, visitorName, visitorEmail);
    }, 10000);

    return () => clearInterval(interval);
  }, [loading, error, isPreview, sessionId, currentStep, randomId]);

  // 3. Step Progression & Telemetry Sync
  useEffect(() => {
    if (loading || error || isPreview || !sessionId) return;

    const stepKey = STEP_KEYS[currentStep - 1] || 'step';
    const dwellSeconds = Math.round((Date.now() - stepStartTime.current) / 1000);

    // Log previous step telemetry
    logPageVisit(randomId, {
      sessionId,
      pageKey: stepKey,
      durationSeconds: dwellSeconds,
      completed: currentStep === 11
    });

    // Reset step timer
    stepStartTime.current = Date.now();

    // Sync server-authoritative current step
    syncStepServer(randomId, sessionId, currentStep);

    // If reached ending step (11), submit stored feedback/reflections automatically
    if (currentStep === 11) {
      const { visitorName, visitorEmail } = useFriendStore.getState();
      submitFeedbackServer(randomId, {
        sessionId,
        visitorName,
        visitorEmail,
        likedGift: feedback.likedGift,
        likedMostText: feedback.likedMostText,
        didntLikeText: feedback.didntLikeText,
        reflectionAnswers: reflections
      });
    }
  }, [currentStep]);

  const toggleBgAudio = () => {
    if (!pageData?.backgroundMusicUrl) return;
    if (audioPlaying) {
      bgAudioRef.current.pause();
      setAudioPlaying(false);
    } else {
      bgAudioRef.current.play();
      setAudioPlaying(true);
    }
  };

  const handleStartAudio = () => {
    if (pageData?.backgroundMusicUrl && !audioPlaying) {
      bgAudioRef.current.play().catch(() => {});
      setAudioPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
        <div className="animate-spin w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full mb-4" />
        <p className="text-sm font-medium text-slate-400 font-serif italic">Unwrapping your gift experience...</p>
      </div>
    );
  }

  if (error || !pageData) {
    return <NotFoundPage />;
  }

  // Theme Styling
  const customBg = pageData.theme?.customColors?.background || '#090D16';
  const customText = pageData.theme?.customColors?.text || '#FFF1F2';

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep pageData={pageData} onNext={nextStep} onPlayAudio={handleStartAudio} />;
      case 2:
        return <GreetingStep pageData={pageData} onNext={nextStep} />;
      case 3:
        return <PromptStep pageData={pageData} onNext={nextStep} />;
      case 4:
        return <TimelineStep pageData={pageData} onNext={nextStep} />;
      case 5:
        return <GalleryStep pageData={pageData} onNext={nextStep} />;
      case 6:
        return <VoiceNoteStep pageData={pageData} onNext={nextStep} />;
      case 7:
        return <SurprisePromptStep pageData={pageData} onNext={nextStep} />;
      case 8:
        return <PoemStep pageData={pageData} onNext={nextStep} />;
      case 9:
        return <FeedbackStep onNext={nextStep} />;
      case 10:
        return <ReflectionStep onNext={nextStep} />;
      case 11:
        return <EndingStep pageData={pageData} />;
      default:
        return <WelcomeStep pageData={pageData} onNext={nextStep} onPlayAudio={handleStartAudio} />;
    }
  };

  const themeConfig = (() => {
    const t = (pageData.themeName || 'mickey').toLowerCase();
    switch (t) {
      case 'mickey':
      case 'mickey_mouse':
        return { bgGradient: 'from-red-950 via-slate-950 to-amber-950', accentText: 'text-red-400', barGradient: 'from-red-500 to-amber-400', character: 'mickey' };
      case 'dog':
      case 'puppy':
        return { bgGradient: 'from-amber-950 via-slate-950 to-orange-950', accentText: 'text-amber-400', barGradient: 'from-amber-500 to-orange-400', character: 'dog' };
      case 'elephant':
      case 'ocean':
        return { bgGradient: 'from-blue-950 via-slate-950 to-cyan-950', accentText: 'text-blue-400', barGradient: 'from-blue-500 to-cyan-400', character: 'elephant' };
      case 'cat':
      case 'kitten':
      case 'rose':
      case 'violet':
        return { bgGradient: 'from-pink-950 via-slate-950 to-purple-950', accentText: 'text-pink-400', barGradient: 'from-pink-500 to-purple-400', character: 'cat' };
      case 'rabbit':
      case 'bunny':
      case 'emerald':
        return { bgGradient: 'from-emerald-950 via-slate-950 to-teal-950', accentText: 'text-emerald-400', barGradient: 'from-emerald-500 to-teal-400', character: 'rabbit' };
      default:
        return { bgGradient: 'from-red-950 via-slate-950 to-amber-950', accentText: 'text-red-400', barGradient: 'from-red-500 to-amber-400', character: 'mickey' };
    }
  })();

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${themeConfig.bgGradient} transition-colors duration-500`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Progress Bar */}
      <header className="sticky top-0 z-40 px-6 py-4 backdrop-blur-md bg-slate-950/60 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CuteMascots type={themeConfig.character} />
          <span className="text-xs font-bold font-display uppercase tracking-widest text-white">
            {pageData.friendName}'s Journey
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="w-24 sm:w-36 bg-slate-800/80 h-2 rounded-full overflow-hidden border border-white/10">
            <div
              className={`bg-gradient-to-r ${themeConfig.barGradient} h-full transition-all duration-300`}
              style={{ width: `${(currentStep / 11) * 100}%` }}
            />
          </div>
          <span className={`text-xs font-mono font-semibold ${themeConfig.accentText}`}>{currentStep}/11</span>
        </div>

        {/* Ambient Audio Toggle */}
        {pageData.backgroundMusicUrl && (
          <button
            onClick={toggleBgAudio}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title={audioPlaying ? 'Mute Background Audio' : 'Play Background Audio'}
          >
            {audioPlaying ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}
      </header>

      {/* Welcome Back Micro-Moment Banner */}
      <AnimatePresence>
        {showWelcomeBack && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-rose-900/90 to-purple-900/90 border-b border-rose-500/30 px-4 py-2.5 text-center text-xs font-medium text-white flex items-center justify-center gap-2 z-30"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Welcome back! Resuming your journey at Step {currentStep}.</span>
            <button
              onClick={dismissWelcomeBack}
              className="p-1 hover:bg-white/10 rounded-lg ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Step Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          {renderStepComponent()}
        </AnimatePresence>
      </main>

      {/* Footer / Step Bar */}
      <footer className="px-6 py-4 backdrop-blur-md bg-slate-950/40 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-white/10 flex items-center gap-1 transition-colors text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Step
        </button>

        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
          For You • Personalized Experience
        </span>
      </footer>
    </div>
  );
};
