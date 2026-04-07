import axios from 'axios';

// Create an Axios instance
const axiosClient = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', // Adjust this if your Spring Boot server runs on a different port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach the token to headers
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (like expired tokens)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized - we can force a logout here later
      console.error('Unauthorized access - perhaps the token expired?');
      // localStorage.removeItem('jwt_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;