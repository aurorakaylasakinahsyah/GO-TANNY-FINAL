const getBaseUrl = () => {
  return import.meta.env.VITE_BASE_URL || 'http://localhost:7000';
};

const getAnalyzeUrl = () => {
  if (import.meta.env.VITE_ANALYZE_URL) {
      return import.meta.env.VITE_ANALYZE_URL;
  }
  // Default local development
  return 'http://localhost:8000/analyze';
};

export const API_ENDPOINTS = {
  AUTH: `${getBaseUrl()}/api/auth`,
  ANALYZE: getAnalyzeUrl()
};
