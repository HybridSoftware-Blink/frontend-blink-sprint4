import { apiClient } from '@/shared/services/api.service';
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

  async logout(): Promise<void> {
    try {
      await apiClient.post('/v1/auth/logout');
    } finally {
      this.clearAuth();
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<any>('/v1/auth/me');
    const data = response?.data ?? response;
    return {
      id: data.id || data.user_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      email_verified_at: data.email_verified_at,
      created_at: data.created_at,
      updated_at: data.updated_at,
    } as User;
  },

  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

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
