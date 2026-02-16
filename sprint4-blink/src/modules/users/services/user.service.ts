import { apiClient } from '@/shared/services/api.service';
import type { 
  User, 
  CreateUserData, 
  UpdateUserData, 
  UsersResponse
} from '../types/user.types';

export const userService = {
  /**
   * Obtener lista de usuarios
   */
  async getUsers(page: number = 1, perPage: number = 10): Promise<UsersResponse> {
    const response = await apiClient.get<any>(`/users?page=${page}&per_page=${perPage}`);
    
    // Manejar diferentes formatos de respuesta
    if (Array.isArray(response)) {
      return {
        data: response,
      };
    } else if (response && typeof response === 'object' && 'data' in response) {
      return {
        data: response.data,
        meta: response.meta,
      };
    }
    return { data: [] };
  },

  /**
   * Crear un nuevo usuario
   */
  async createUser(data: CreateUserData): Promise<User> {
    const response = await apiClient.post<any>('/users', data);
    return response.data ? response.data : response;
  },

  /**
   * Actualizar un usuario existente
   */
  async updateUser(id: number, data: UpdateUserData): Promise<User> {
    const response = await apiClient.put<any>(`/users/${id}`, data);
    return response.data ? response.data : response;
  },

  /**
   * Eliminar un usuario
   */
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  /**
   * Buscar usuarios
   */
  async searchUsers(query: string): Promise<UsersResponse> {
    const response = await apiClient.get<any>(`/users/search?query=${query}`);
    
    if (Array.isArray(response)) {
      return {
        data: response,
      };
    } else if (response && typeof response === 'object' && 'data' in response) {
      return {
        data: response.data,
        meta: response.meta,
      };
    }
    return { data: [] };
  },
};
