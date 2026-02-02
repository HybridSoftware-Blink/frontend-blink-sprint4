/**
 * Servicio de autenticación
 * Maneja login, logout, registro y obtención de usuario actual
 */

import { apiClient } from './api.service';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export const authService = {
  normalizeAuthResponse(raw: any): AuthResponse {
    const payload = raw?.data ?? raw;
    const token = payload?.token ?? payload?.access_token ?? payload?.accessToken;
    const user = payload?.user ?? payload?.data?.user;

    if (!token) {
      throw {
        message: 'Respuesta de login inválida: falta token',
        errors: {},
      };
    }

    return {
      token,
      user,
    } as AuthResponse;
  },

  /**
   * Inicia sesión de usuario
   * @param credentials - Email y contraseña
   * @returns Token y datos del usuario
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const raw = await apiClient.post<any>('/v1/auth/login', credentials);
    const normalized = this.normalizeAuthResponse(raw);

    this.setToken(normalized.token);

    if (normalized.user) {
      this.setUser(normalized.user);
      return normalized;
    }

    const me = await this.getCurrentUser();
    this.setUser(me);
    return { token: normalized.token, user: me };
  },

  /**
   * Registra un nuevo usuario
   * @param data - Datos de registro
   * @returns Token y datos del usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const raw = await apiClient.post<any>('/v1/auth/register', data);
    const normalized = this.normalizeAuthResponse(raw);

    this.setToken(normalized.token);

    if (normalized.user) {
      this.setUser(normalized.user);
      return normalized;
    }

    const me = await this.getCurrentUser();
    this.setUser(me);
    return { token: normalized.token, user: me };
  },

  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/v1/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar datos locales siempre
      this.clearAuth();
    }
  },

  /**
   * Obtiene el usuario autenticado actual
   * @returns Datos del usuario
   */
  async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>('/v1/auth/me');
  },

  /**
   * Cambia la contraseña del usuario actual
   * @param currentPassword - Contraseña actual
   * @param newPassword - Nueva contraseña
   * @param newPasswordConfirmation - Confirmación de nueva contraseña
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ): Promise<{ message: string }> {
    return await apiClient.post('/v1/auth/change-password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPasswordConfirmation,
    });
  },

  /**
   * Guarda el token en localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  /**
   * Obtiene el token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setUser(user: User): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  getUser(): User | null {
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  clearAuth(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
};
