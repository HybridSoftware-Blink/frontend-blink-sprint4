import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const USERS_KEY = 'mock_users';

interface StoredUser extends User {
  password: string;
}

// Cargar usuarios desde localStorage
function loadUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : getDefaultUsers();
  } catch (error) {
    return getDefaultUsers();
  }
}

// Usuarios por defecto
function getDefaultUsers(): StoredUser[] {
  return [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@blink.com',
      password: 'admin123',
      phone: '+34 600 000 001',
      role: 'admin',
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Usuario Test',
      email: 'user@blink.com',
      password: 'user123',
      phone: '+34 600 000 002',
      role: 'user',
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

// Guardar usuarios
function saveUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

let users = loadUsers();
let nextUserId = Math.max(...users.map(u => u.id), 0) + 1;

export const authServiceMock = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = users.find(u => u.email === credentials.email);
    
    if (!user || user.password !== credentials.password) {
      throw {
        message: 'errors.invalidCredentials',
        errors: { email: ['Credenciales inválidas'] },
      };
    }

    const token = `mock_token_${Date.now()}_${user.id}`;
    
    this.setToken(token);
    
    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;
    
    this.setUser(userWithoutPassword);

    return {
      token,
      user: userWithoutPassword,
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verificar si el email ya existe
    if (users.find(u => u.email === data.email)) {
      throw {
        message: 'errors.emailAlreadyExists',
        errors: { email: ['El email ya está registrado'] },
      };
    }

    const newUser: StoredUser = {
      id: nextUserId++,
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      role: 'user',
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const token = `mock_token_${Date.now()}_${newUser.id}`;
    
    this.setToken(token);
    
    const userWithoutPassword = { ...newUser };
    delete (userWithoutPassword as any).password;
    
    this.setUser(userWithoutPassword);

    return {
      token,
      user: userWithoutPassword,
    };
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.clearAuth();
  },

  async getCurrentUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored) {
      throw {
        message: 'errors.notAuthenticated',
        errors: {},
      };
    }

    return JSON.parse(stored);
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
    const stored = localStorage.getItem(AUTH_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  clearAuth(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  },
};
