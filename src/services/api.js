// src/services/api.js
import { trackApiCall, trackError } from '../utils/debug';

// Mock data for development and testing
const mockMeasurements = [
  {
    id: '1',
    timestamp: Math.floor(Date.now() / 1000),
    pupillaryDistance: 62.5,
    verticalDifference: 2.3,
    noseBridgeWidth: 18.0,
    symmetryScore: 0.9,
    confidenceMetrics: { stabilityScore: 0.9, eyeOpennessScore: 0.85, faceOrientationScore: 0.88 },
    deviceInfo: 'iPhone 14',
    appVersion: '1.0.0',
  },
];

const mockAnalysis = {
  populationComparison: { averagePD: 63.0, percentile: 45 },
  recommendations: true,
};

const mockRecommendations = [
  { id: '1', name: 'Classic Aviator', price: 99.99, imageUrl: 'https://via.placeholder.com/100', brandName: 'Ray-Ban', fitScore: 92 },
  { id: '2', name: 'Round Frames', price: 79.99, imageUrl: 'https://via.placeholder.com/100', brandName: 'Warby Parker', fitScore: 88 },
];

// API base URL - change this to your API server in production
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
    
    const fetchOptions = { ...defaultOptions, ...options };
    
    // For debugging request
    trackApiCall(endpoint, fetchOptions, 'request');
    
    const response = await fetch(url, fetchOptions);
    
    // If using real API (not mocks), uncomment this:
    /*
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    trackApiCall(endpoint, fetchOptions, data);
    return data;
    */
    
    // For development with mocks:
    trackApiCall(endpoint, fetchOptions, 'Mock API used');
    
    return getMockResponse(endpoint);
  } catch (error) {
    trackError('API', error, endpoint);
    throw error;
  }
};

// Helper to get mock responses based on endpoint
const getMockResponse = (endpoint) => {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      if (endpoint.includes('/measurements')) {
        if (endpoint.includes('/analyze')) {
          resolve(mockAnalysis);
        } else if (endpoint.includes('/recommendations')) {
          resolve(mockRecommendations);
        } else if (endpoint.match(/\/measurements\/\d+/)) {
          const id = endpoint.split('/').pop();
          const measurement = mockMeasurements.find(m => m.id === id) || mockMeasurements[0];
          resolve(measurement);
        } else {
          resolve(mockMeasurements);
        }
      } else if (endpoint.includes('/shop/recommendations')) {
        resolve(mockRecommendations);
      } else {
        // Default fallback
        resolve({ message: 'Endpoint not mocked' });
      }
    }, 500); // Simulate network delay
  });
};

// Measurements API
export const MeasurementsApi = {
  getAll: async () => apiRequest('/measurements'),
  
  getById: async (id) => apiRequest(`/measurements/${id}`),
  
  create: async (data) => apiRequest('/measurements', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  analyze: async (id) => apiRequest(`/measurements/${id}/analyze`),
  
  getRecommendedProducts: async (id) => apiRequest(`/measurements/${id}/recommendations`),
};

// Shop API
export const ShopApi = {
  getRecommendations: async (filters = {}) => apiRequest('/shop/recommendations', {
    method: 'POST',
    body: JSON.stringify(filters)
  }),
  
  getProduct: async (id) => apiRequest(`/shop/products/${id}`),
}; 