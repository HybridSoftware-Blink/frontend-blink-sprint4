import { apiClient } from '@/shared/services/api.service';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/login', credentials);
    
    // Manejar diferentes formatos de respuesta del backend
    const data = response.data || response;
    const token = data.access_token || response.token || response.access_token;
    let user = data.user || response.user || data;
    
    // Mapear user_id a id si es necesario
    if (user && user.user_id && !user.id) {
      user = { ...user, id: user.user_id };
    }
    
    if (!token) {
      throw new Error('No se recibió token de autenticación');
    }
    
    // Guardar token y usuario
    this.setToken(token);
    if (user && typeof user === 'object') {
      this.setUser(user);
    }
    
    return {
      user: user || {} as User,
      token: token,
    };
  },

  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/register', data);
    
    // Manejar diferentes formatos de respuesta del backend
    const responseData = response.data || response;
    const token = responseData.access_token || response.token || response.access_token;
    let user = responseData.user || response.user || responseData;
    
    // Mapear user_id a id si es necesario
    if (user && user.user_id && !user.id) {
      user = { ...user, id: user.user_id };
    }
    
    if (!token) {
      throw new Error('No se recibió token de autenticación');
    }
    
    // Guardar token y usuario
    this.setToken(token);
    if (user && typeof user === 'object') {
      this.setUser(user);
    }
    
    return {
      user: user || {} as User,
      token: token,
    };
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continuar aunque falle la llamada al servidor
      console.error('Error during logout:', error);
    } finally {
      this.clearAuth();
    }
  },

  /**
   * Obtener usuario actual
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<any>('/auth/me');
    let user = response.data || response;
    
    // Mapear user_id a id si es necesario
    if (user && user.user_id && !user.id) {
      user = { ...user, id: user.user_id };
    }
    
    this.setUser(user);
    return user;
  },

  /**
   * Guardar token
   */
  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  /**
   * Obtener token
   */
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Guardar usuario
   */
  setUser(user: User): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  /**
   * Obtener usuario guardado
   */
  getUser(): User | null {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored || stored === 'undefined' || stored === 'null') {
      return null;
    }
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      this.clearAuth();
      return null;
    }
  },

  /**
   * Limpiar autenticación
   */
  clearAuth(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  /**
   * Verificar si hay una sesión activa
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
