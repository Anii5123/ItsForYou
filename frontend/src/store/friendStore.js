import { create } from 'zustand';

export const useFriendStore = create((set, get) => ({
  pageData: null,
  currentStep: 1,
  sessionId: null,
  visitorName: '',
  visitorEmail: '',
  isResumed: false,
  showWelcomeBack: false,
  
  // Local form draft state
  feedback: {
    likedGift: true,
    likedMostText: '',
    didntLikeText: ''
  },
  reflections: {
    whatAmIToYou: '',
    describeOurFriendship: '',
    favouriteMemory: '',
    anythingElse: '',
    friendVoiceNoteUrl: ''
  },

  initPage: (pageData, randomId, friendSlug) => {
    const storageKey = `foryou_session_${randomId}`;
    const timeKey = `foryou_session_timestamp_${randomId}`;
    const stepKey = `foryou_step_${randomId}`;
    
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const now = Date.now();
    const lastSessionTime = parseInt(localStorage.getItem(timeKey) || '0', 10);
    const isExpired = (now - lastSessionTime) > ONE_HOUR_MS;

    let savedSessionId = localStorage.getItem(storageKey);
    let savedName = localStorage.getItem(`foryou_visitor_name_${randomId}`) || '';
    let savedEmail = localStorage.getItem(`foryou_visitor_email_${randomId}`) || '';

    // If session doesn't exist or is > 1 hour old, create fresh session and clear cached credentials
    if (!savedSessionId || isExpired) {
      savedSessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem(storageKey, savedSessionId);
      localStorage.setItem(timeKey, now.toString());
      if (isExpired) {
        localStorage.removeItem(`foryou_visitor_name_${randomId}`);
        localStorage.removeItem(`foryou_visitor_email_${randomId}`);
        savedName = '';
        savedEmail = '';
      }
    }

    // ALWAYS start at Step 1 whenever opening the link afresh
    localStorage.setItem(stepKey, '1');

    set({
      pageData,
      currentStep: 1,
      sessionId: savedSessionId,
      visitorName: savedName,
      visitorEmail: savedEmail,
      isResumed: false,
      showWelcomeBack: false
    });
  },

  setVisitorDetails: (name, email) => {
    const { pageData } = get();
    if (pageData?.randomId) {
      localStorage.setItem(`foryou_visitor_name_${pageData.randomId}`, name);
      localStorage.setItem(`foryou_visitor_email_${pageData.randomId}`, email);
      localStorage.setItem(`foryou_session_timestamp_${pageData.randomId}`, Date.now().toString());
    }
    set({ visitorName: name, visitorEmail: email });
  },

  setStep: (step) => {
    const { pageData } = get();
    const targetStep = Math.min(Math.max(step, 1), 11);
    
    if (pageData?.randomId) {
      localStorage.setItem(`foryou_step_${pageData.randomId}`, targetStep.toString());
    }

    set({ currentStep: targetStep });
  },

  nextStep: () => {
    const { currentStep, setStep } = get();
    if (currentStep < 11) {
      setStep(currentStep + 1);
    }
  },

  prevStep: () => {
    const { currentStep, setStep } = get();
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  },

  dismissWelcomeBack: () => {
    set({ showWelcomeBack: false });
  },

  updateFeedback: (key, val) => {
    set((state) => ({
      feedback: { ...state.feedback, [key]: val }
    }));
  },

  updateReflection: (key, val) => {
    set((state) => ({
      reflections: { ...state.reflections, [key]: val }
    }));
  }
}));
