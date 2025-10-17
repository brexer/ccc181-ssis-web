import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);
export const verifyToken = () => api.post('/verify');

export const getColleges = () => api.get('/colleges');
export const addCollege = (data) => api.post('/colleges', data);
export const updateCollege = (code, data) => api.put(`/colleges/${code}`, data);
export const deleteCollege = (code) => api.delete(`/colleges/${code}`);

export const getPrograms = () => api.get('/programs');
export const addProgram = (data) => api.post('/programs', data);
export const updateProgram = (code, data) => api.put(`/programs/${code}`, data);
export const deleteProgram = (code) => api.delete(`/programs/${code}`);

export const getStudents = () => api.get('/students');
export const addStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

export default api;