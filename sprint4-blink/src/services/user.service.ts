import { apiClient } from './api.service';
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
  async getUsers(page: number = 1, perPage: number = 10): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>(`/v1/users?page=${page}&per_page=${perPage}`);
    return response;
  },

  /**
   * Obtener todos los usuarios sin paginación
   */
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<UsersResponse>('/v1/users?all=true');
    return response.data;
  },

  /**
   * Obtener un usuario por ID
   */
  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<UserResponse>(`/v1/users/${id}`);
    return response.data;
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
    const response = await apiClient.get<UsersResponse>(`/v1/users/search?q=${query}`);
    return response.data;
  },
};
