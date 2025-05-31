// src/utils/sessionStorage.js
const SESSION_STORAGE_KEY = 'bluescan_session_data';

export const saveImageToSession = (imageData) => {
  const sessionData = getSessionData();
  sessionData.images.push({
    ...imageData,
    uploadedAt: new Date().toISOString(),
  });
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
};

export const saveAnalysisToSession = (imageId, analysisResults) => {
  const sessionData = getSessionData();
  const imageIndex = sessionData.images.findIndex(img => img.id === imageId);
  if (imageIndex !== -1) {
    sessionData.images[imageIndex].analysisResults = analysisResults;
    sessionData.analyses.push(analysisResults);
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
};

export const getSessionData = () => {
  const data = localStorage.getItem(SESSION_STORAGE_KEY);
  return data ? JSON.parse(data) : {
    images: [],
    analyses: [],
    hotspots: [],
    sessionStart: new Date().toISOString()
  };
};

export const addHotspotToSession = (location, severity) => {
  const sessionData = getSessionData();
  sessionData.hotspots.push({
    id: Date.now(),
    ...location,
    severity,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
};