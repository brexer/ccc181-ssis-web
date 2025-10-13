import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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