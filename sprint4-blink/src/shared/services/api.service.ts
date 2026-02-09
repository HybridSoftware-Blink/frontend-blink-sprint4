import axios, { type AxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api.types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error server
      throw {
        message: error.response.data?.message || 'Error en la petición',
        errors: error.response.data?.errors || {},
        status: error.response.status,
      } as ApiError & { status: number };
    }
    
    // Error de red o otros
    throw {
      message: 'Error de conexión con el servidor',
      errors: {},
    } as ApiError;
  }
);

/**
 * Realiza una petición HTTP a la API
 */
async function request<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const response = await axiosInstance.request<T>({
    url: endpoint,
    ...options,
  });
  return response.data;
}

export const apiClient = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, data?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      data,
    }),

  put: <T>(endpoint: string, data?: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      data,
    }),

  patch: <T>(endpoint: string, data?: any) =>
    request<T>(endpoint, {
      method: 'PATCH',
      data,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

