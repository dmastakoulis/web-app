import axios from 'axios';

const API_BASE = '/api';
const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

export const getStudents = () => api.get('/students/list/');
export const getStudent = (id) => api.get(`/students/list/${id}/`);
export const createStudent = (data) => api.post('/students/list/', data);
export const updateStudent = (id, data) => api.put(`/students/list/${id}/`, data);
export const deleteStudent = (id) => api.delete(`/students/list/${id}/`);
export const getStudentStats = () => api.get('/students/stats/');
export const getCourses = () => api.get('/students/courses/');
export const getEnrollments = (params) => api.get('/students/enrollments/', { params });
export const createEnrollment = (data) => api.post('/students/enrollments/', data);
export const updateEnrollment = (id, data) => api.put(`/students/enrollments/${id}/`, data);
export const deleteEnrollment = (id) => api.delete(`/students/enrollments/${id}/`);
export const predict = (data) => api.post('/predictor/predict/', data);
export const trainModel = () => api.post('/predictor/train/');
export const getModelInfo = () => api.get('/predictor/info/');
export const getPredictions = () => api.get('/students/prediction-log/');
export const seedSampleData = () => api.post('/predictor/seed/');
