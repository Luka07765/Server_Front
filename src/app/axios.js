import axios from 'axios';

const API_BASE_URL = 'http://localhost:5218/api/notes'; // Update with your backend URL

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
const NoteService = {
  getAllNotes: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  getNoteById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      throw error;
    }
  },

  createNote: async (noteData) => {
    try {
      const response = await api.post('/', noteData);
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  updateNote: async (id, noteData) => {
    try {
      const response = await api.put(`/${id}`, noteData);
      return response.data;
    } catch (error) {
      console.error(`Error updating note ${id}:`, error);
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      throw error;
    }
  },
};

export default NoteService;
