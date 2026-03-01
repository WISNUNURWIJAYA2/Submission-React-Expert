// src/utils/api.js
import axios from 'axios';

const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const getAccessToken = () => localStorage.getItem('accessToken');
const putAccessToken = (token) => localStorage.setItem('accessToken', token);

const api = (() => {
  axios.defaults.baseURL = BASE_URL;

  // Interceptor untuk menyisipkan token otomatis
  axios.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  async function register({ name, email, password }) {
    const { data } = await axios.post('/register', { name, email, password });
    return data.data.user;
  }

  async function login({ email, password }) {
    const { data } = await axios.post('/login', { email, password });
    putAccessToken(data.data.token);
    return data.data.token;
  }

  async function getAllUsers() {
    const { data } = await axios.get('/users');
    return data.data.users;
  }

  async function getAllThreads() {
    const { data } = await axios.get('/threads');
    return data.data.threads;
  }

  async function getThreadDetail(id) {
    const { data } = await axios.get(`/threads/${id}`);
    return data.data.detailThread;
  }

  async function createThread({ title, body, category }) {
    const { data } = await axios.post('/threads', { title, body, category });
    return data.data.thread;
  }

  async function createComment({ content, threadId }) {
    const { data } = await axios.post(`/threads/${threadId}/comments`, { content });
    return data.data.comment;
  }

  async function getOwnProfile() {
    const { data } = await axios.get('/users/me');
    return data.data.user;
  }

  return {
    register, login, getAllUsers, getAllThreads, getThreadDetail, createThread, createComment, getOwnProfile, putAccessToken, getAccessToken,
  };
})();

export default api;
