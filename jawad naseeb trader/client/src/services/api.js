import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user && user.token) {
    config.headers.Authorization = 'Bearer ' + user.token;
  }
  return config;
});

export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

export const getCourses = () => API.get('/courses');
export const getCourseById = (id) => API.get('/courses/' + id);
export const createCourse = (data) => API.post('/courses', data);

export const getLessons = (courseId) => API.get('/lessons/' + courseId);
export const createLesson = (data) => API.post('/lessons', data);

export const getNews = () => API.get('/news');
export const getNewsBySlug = (slug) => API.get('/news/' + slug);
export const createNews = (data) => API.post('/news', data);

export const getMarketData = () => API.get('/market');
export const getMarketChart = (id, days = 1) => API.get('/market/' + id + '/chart/' + days);

export const submitContact = (data) => API.post('/contact', data);
export const getContacts = () => API.get('/contact');

export default API;
