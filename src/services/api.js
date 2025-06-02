import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Create an axios instance with base URL
const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for error handling
api.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// Analyze a URL
export const analyzeURL = async (url) => {
  try {
    const response = await api.post('/api/v1/analyse', { url });
    if (!response.data || !response.data.analysis) {
      throw new Error('Invalid response format from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error analyzing URL:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Failed to analyze URL. Please try again.'
    );
  }
};

// Revise text based on analysis
export const reviseText = async (text, analysis) => {
  try {
    if (!text || !analysis) {
      throw new Error('Missing required data for revision');
    }
    
    const response = await api.post('/api/v1/revise', {
      text,
      analysis
    });
    
    if (!response.data || !response.data.revised_text) {
      throw new Error('Invalid response format from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error revising text:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message ||
      'Failed to revise text. Please try again.'
    );
  }
};

export default api;