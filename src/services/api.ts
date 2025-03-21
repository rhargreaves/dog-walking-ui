import axios from 'axios';
import { Dog } from '../types';

// Set the base URL from environment variable or use default
const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export default api;