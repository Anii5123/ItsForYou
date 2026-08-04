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
    // Generate or retrieve persistent sessionId for this friend experience
    const storageKey = `foryou_session_${randomId}`;
    const stepKey = `foryou_step_${randomId}`;
    
    let savedSessionId = localStorage.getItem(storageKey);
    let isNewDevice = false;
    if (!savedSessionId) {
      savedSessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem(storageKey, savedSessionId);
      isNewDevice = true;
    }

    const savedName = localStorage.getItem(`foryou_visitor_name_${randomId}`) || '';
    const savedEmail = localStorage.getItem(`foryou_visitor_email_${randomId}`) || '';

    // Determine starting step per device: new device starts at Step 1 always
    const localStep = parseInt(localStorage.getItem(stepKey) || '1', 10);
    const startingStep = isNewDevice ? 1 : Math.min(Math.max(localStep, 1), 11);

    const isResumed = startingStep > 1;

    set({
      pageData,
      currentStep: startingStep,
      sessionId: savedSessionId,
      visitorName: savedName,
      visitorEmail: savedEmail,
      isResumed,
      showWelcomeBack: isResumed
    });
  },

  setVisitorDetails: (name, email) => {
    const { pageData } = get();
    if (pageData?.randomId) {
      localStorage.setItem(`foryou_visitor_name_${pageData.randomId}`, name);
      localStorage.setItem(`foryou_visitor_email_${pageData.randomId}`, email);
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
