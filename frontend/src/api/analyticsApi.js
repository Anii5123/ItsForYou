import api from './client';

export const startSession = async (randomId, sessionId, visitorName, visitorEmail) => {
  const response = await api.post(`/f/${randomId}/session`, {
    sessionId,
    visitorName,
    visitorEmail,
    userAgent: navigator.userAgent
  });
  return response.data;
};

export const sendHeartbeat = async (randomId, sessionId, currentStep, durationSeconds, completed, visitorName, visitorEmail) => {
  const response = await api.post(`/f/${randomId}/heartbeat`, {
    sessionId,
    currentStep,
    durationSeconds,
    completed,
    visitorName,
    visitorEmail
  });
  return response.data;
};

export const logPageVisit = async (randomId, data) => {
  // Fire-and-forget friendly beacon attempt
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    navigator.sendBeacon(`/api/f/${randomId}/page-visit`, blob);
  } else {
    await api.post(`/f/${randomId}/page-visit`, data);
  }
};

export const syncStepServer = async (randomId, sessionId, currentStep) => {
  const response = await api.post(`/f/${randomId}/step`, { sessionId, currentStep });
  return response.data;
};

export const logVoiceEvent = async (randomId, data) => {
  const response = await api.post(`/f/${randomId}/voice-event`, data);
  return response.data;
};

export const logPoemEvent = async (randomId, data) => {
  const response = await api.post(`/f/${randomId}/poem-event`, data);
  return response.data;
};

export const submitFeedbackServer = async (randomId, data) => {
  const response = await api.post(`/f/${randomId}/feedback`, data);
  return response.data;
};

export const fetchPageAnalytics = async (id) => {
  const response = await api.get(`/admin/pages/${id}/analytics`);
  return response.data;
};

export const fetchLiveStatus = async (id) => {
  const response = await api.get(`/admin/pages/${id}/live`);
  return response.data;
};
