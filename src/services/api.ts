import axios from 'axios';
import { Dog } from '../types';

// Extend Window interface to include our global auth token getter
declare global {
  interface Window {
    getAuthToken?: () => Promise<string | null>;
  }
}

// Production API URL (from environment variable or default)
const prodBaseURL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

// Local development API & auth URLs
const localBaseURL = 'http://localhost:3002/api';
const localAuthURL = 'http://localhost:3002/auth';

// Choose the appropriate base URL based on environment
const baseURL = process.env.NODE_ENV === 'development' ? localBaseURL : prodBaseURL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to attach the auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // Get token from localStorage in development mode
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // In production, get the token from the AuthContext's getAuthToken
      // Since we can't directly access the context here, we'll use a globally accessible
      // token getter function that will be set by AuthContext
      if (window.getAuthToken) {
        const token = await window.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
  } catch (error) {
    console.error('Error adding auth token to request:', error);
  }
  return config;
});

export const dogService = {
  // Get all dogs
  getAllDogs: async (): Promise<Dog[]> => {
    const response = await api.get('/dogs');
    return response.data;
  },

  // Get a specific dog by ID
  getDog: async (id: string): Promise<Dog> => {
    const response = await api.get(`/dogs/${id}`);
    return response.data;
  },

  // Create a new dog
  createDog: async (dog: Omit<Dog, 'id'>): Promise<Dog> => {
    const response = await api.post('/dogs', dog);
    return response.data;
  },

  // Update an existing dog
  updateDog: async (id: string, dog: Partial<Dog>): Promise<Dog> => {
    const response = await api.put(`/dogs/${id}`, dog);
    return response.data;
  },

  // Delete a dog
  deleteDog: async (id: string): Promise<void> => {
    await api.delete(`/dogs/${id}`);
  },

  // Upload a dog photo
  uploadDogPhoto: async (id: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await api.put(`/dogs/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Detect dog breed from photo
  detectBreed: async (id: string): Promise<Dog> => {
    const response = await api.post(`/dogs/${id}/photo/detect-breed`);
    return response.data;
  }
};

// Auth service for development mode
export const authService = {
  login: async (username: string, password: string): Promise<{ token: string, user: { username: string, email: string } }> => {
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use the local auth service
      const response = await axios.post(`${localAuthURL}/login`, {
        username,
        password
      });
      return response.data;
    }
    throw new Error('This method should only be used in development mode');
  },

  // Method to register the global auth token getter
  registerTokenGetter: (getter: () => Promise<string | null>) => {
    window.getAuthToken = getter;
  }
};

export default api;