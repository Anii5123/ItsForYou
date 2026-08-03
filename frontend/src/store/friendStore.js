import { create } from 'zustand';

export const useFriendStore = create((set, get) => ({
  pageData: null,
  currentStep: 1,
  sessionId: null,
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
    anythingElse: ''
  },

  initPage: (pageData, randomId, friendSlug) => {
    // Generate or retrieve persistent sessionId for this friend experience
    const storageKey = `foryou_session_${randomId}`;
    const stepKey = `foryou_step_${randomId}`;
    
    let savedSessionId = localStorage.getItem(storageKey);
    if (!savedSessionId) {
      savedSessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
      localStorage.getItem(storageKey, savedSessionId);
    }

    // Determine starting step: check server currentStep vs local step
    const localStep = parseInt(localStorage.getItem(stepKey) || '1', 10);
    const serverStep = pageData.currentStep || 1;
    const startingStep = Math.max(localStep, serverStep);

    const isResumed = startingStep > 1;

    set({
      pageData,
      currentStep: startingStep,
      sessionId: savedSessionId,
      isResumed,
      showWelcomeBack: isResumed
    });
  },

  setStep: (step) => {
    const { pageData, randomId } = get();
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
