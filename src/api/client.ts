import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

// Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api', // This will be proxied to http://localhost:8080 by Vite
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can attach authorization tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Handle global errors here (e.g., 401 Unauthorized -> redirect to login)
    if (error.response?.status === 401) {
      // console.warn('Unauthorized access, please log in.');
    }
    return Promise.reject(error)
  },
)

export default apiClient
