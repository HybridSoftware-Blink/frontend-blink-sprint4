import { apiClient } from '@/shared/services/api.service';
import type { 
  User, 
  CreateUserData, 
  UpdateUserData, 
  UsersResponse,
  UserResponse 
} from '../types/user.types';

export const userService = {
  /**
   * Obtener lista de usuarios
   */
  async getUsers(page: number = 1, perPage: number = 5): Promise<UsersResponse> {
    const response = await apiClient.get<any>(`/v1/users?page=${page}&per_page=${perPage}`);
    
    // Mapear user_id a id si es necesario
    const mapUser = (user: any): User => ({
      ...user,
      id: user.id || user.user_id,
    });
    
    if (Array.isArray(response)) {
      return {
        data: response.map(mapUser),
      };
    } else if (response && typeof response === 'object' && 'data' in response) {
      return {
        data: response.data.map(mapUser),
        meta: response.meta,
      };
    }
    return { data: [] };
  },

  /**
   * Crear un nuevo usuario
   */
  async createUser(data: CreateUserData): Promise<User> {
    const response = await apiClient.post<UserResponse>('/v1/users', data);
    return response.data;
  },

  /**
   * Actualizar un usuario existente
   */
  async updateUser(id: number, data: UpdateUserData): Promise<User> {
    const response = await apiClient.put<UserResponse>(`/v1/users/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar un usuario
   */
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/v1/users/${id}`);
  },

  /**
   * Buscar usuarios por nombre o email
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await apiClient.get<any>(`/v1/users/search?q=${encodeURIComponent(query)}`);
      const data = Array.isArray(response) ? response : response.data || [];
      return data.map((user: any) => ({
        ...user,
        id: user.id || user.user_id,
      }));
    } catch (error: any) {
      // Si la ruta de búsqueda no existe, filtrar localmente
      if (error.status === 404) {
        const response = await apiClient.get<any>(`/v1/users?page=1&per_page=100`);
        const list = Array.isArray(response) ? response : response.data || [];
        const q = query.toLowerCase();
        return list
          .map((user: any) => ({ ...user, id: user.id || user.user_id }))
          .filter((u: User) =>
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q))
          );
      }
      throw error;
    }
  },
};
