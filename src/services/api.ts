import axios, { AxiosError } from 'axios';
import { Dog, ApiError } from '../types';

// Extend Window interface to include our global auth token getter
declare global {
  interface Window {
    getAuthToken?: () => Promise<string | null>;
  }
}

const prodBaseURL = process.env.REACT_APP_API_BASE_URL;
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

// Helper function to extract error details
export const extractErrorDetails = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    // Check if the API returned a structured error response with nested error object
    if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
      // Check if it's the nested error format (ApiErrorResponse)
      if ('error' in axiosError.response.data &&
          typeof axiosError.response.data.error === 'object' &&
          'code' in axiosError.response.data.error &&
          'message' in axiosError.response.data.error) {
        return axiosError.response.data.error as ApiError;
      }

      // Check if it's a direct ApiError format
      if ('code' in axiosError.response.data &&
          'message' in axiosError.response.data) {
        return axiosError.response.data as ApiError;
      }
    }

    // Fallback to generic error with status code
    return {
      code: axiosError.response?.status || 500,
      message: axiosError.response?.statusText || 'An unknown error occurred'
    };
  }

  // Generic error for non-axios errors
  return {
    code: 500,
    message: error?.message || 'An unknown error occurred'
  };
};

export const dogService = {
  // Get all dogs
  getDogs: async (params?: { limit?: number; name?: string; nextToken?: string }): Promise<{ dogs: Dog[]; nextToken?: string }> => {
    try {
      const response = await api.get('/dogs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching dogs:', error);
      throw extractErrorDetails(error);
    }
  },

  // Get a single dog by ID
  getDog: async (id: string): Promise<Dog> => {
    try {
      const response = await api.get(`/dogs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dog ${id}:`, error);
      throw extractErrorDetails(error);
    }
  },

  // Create a new dog
  createDog: async (dog: Omit<Dog, 'id'>): Promise<Dog> => {
    try {
      const response = await api.post('/dogs', dog);
      return response.data;
    } catch (error) {
      console.error('Error creating dog:', error);
      throw extractErrorDetails(error);
    }
  },

  // Update a dog
  updateDog: async (id: string, dog: Partial<Dog>): Promise<Dog> => {
    try {
      const response = await api.put(`/dogs/${id}`, dog);
      return response.data;
    } catch (error) {
      console.error(`Error updating dog ${id}:`, error);
      throw extractErrorDetails(error);
    }
  },

  // Delete a dog
  deleteDog: async (id: string): Promise<void> => {
    try {
      await api.delete(`/dogs/${id}`);
    } catch (error) {
      console.error(`Error deleting dog ${id}:`, error);
      throw extractErrorDetails(error);
    }
  },

  // Upload a dog photo
  uploadDogPhoto: async (id: string, file: File): Promise<void> => {
    try {
      // Read the file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Send the raw file data with Content-Type: image/jpeg
      await api.put(`/dogs/${id}/photo`, arrayBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });
    } catch (error) {
      console.error(`Error uploading photo for dog ${id}:`, error);
      throw extractErrorDetails(error);
    }
  }
};

// Auth service for development mode
export const authService = {
  login: async (username: string, password: string): Promise<{ token: string, user: { username: string, email: string } }> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // In development mode, use the local auth service
        const response = await axios.post(`${localAuthURL}/login`, {
          username,
          password
        });
        return response.data;
      }
      throw new Error('This method should only be used in development mode');
    } catch (error) {
      console.error('Error during login:', error);
      throw extractErrorDetails(error);
    }
  },

  // Method to register the global auth token getter
  registerTokenGetter: (getter: () => Promise<string | null>) => {
    window.getAuthToken = getter;
  }
};

export default api;