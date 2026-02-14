import type { 
  User, 
  CreateUserData, 
  UpdateUserData, 
  UsersResponse
} from '../types/user.types';

const USERS_KEY = 'mock_users';

interface StoredUser extends User {
  password: string;
}

// Cargar usuarios desde localStorage
function loadUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      return getDefaultUsers();
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
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

// Guardar usuarios en localStorage
function saveUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
}

// Obtener siguiente ID
function getNextId(): number {
  const users = loadUsers();
  const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
  return maxId + 1;
}

// Convertir StoredUser a User (sin password)
function toPublicUser(user: StoredUser): User {
  const { password, ...publicUser } = user;
  return publicUser;
}

// Simular delay de red
function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const userService = {
  /**
   * Obtener lista de usuarios con paginación
   */
  async getUsers(page: number = 1, perPage: number = 5): Promise<UsersResponse> {
    await delay();
    
    const users = loadUsers();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedUsers = users.slice(start, end);
    
    return {
      data: paginatedUsers.map(toPublicUser),
      meta: {
        total: users.length,
        per_page: perPage,
        current_page: page,
        last_page: Math.ceil(users.length / perPage),
        from: start + 1,
        to: Math.min(end, users.length),
      },
    };
  },

  /**
   * Crear un nuevo usuario
   */
  async createUser(data: CreateUserData): Promise<User> {
    await delay();
    
    const users = loadUsers();
    
    // Verificar si el email ya existe
    const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existingUser) {
      throw {
        message: 'El correo electrónico ya está registrado',
        errors: { email: ['Este correo ya está en uso'] },
      };
    }
    
    const newUser: StoredUser = {
      id: getNextId(),
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      role: data.role || 'user',
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return toPublicUser(newUser);
  },

  /**
   * Actualizar un usuario existente
   */
  async updateUser(id: number, data: UpdateUserData): Promise<User> {
    await delay();
    
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw {
        message: 'Usuario no encontrado',
        errors: {},
      };
    }
    
    const currentUser = users[userIndex]!;
    
    // Verificar si el email ya existe en otro usuario
    if (data.email) {
      const existingUser = users.find(
        u => u.email.toLowerCase() === data.email!.toLowerCase() && u.id !== id
      );
      if (existingUser) {
        throw {
          message: 'El correo electrónico ya está registrado',
          errors: { email: ['Este correo ya está en uso'] },
        };
      }
    }
    
    // Actualizar usuario
    const updatedUser: StoredUser = {
      ...currentUser,
      id: currentUser.id,
      name: data.name ?? currentUser.name,
      email: data.email ?? currentUser.email,
      phone: data.phone ?? currentUser.phone,
      role: data.role ?? currentUser.role,
      password: data.password ?? currentUser.password,
      updated_at: new Date().toISOString(),
    };
    
    users[userIndex] = updatedUser;
    saveUsers(users);
    
    return toPublicUser(updatedUser);
  },

  /**
   * Eliminar un usuario
   */
  async deleteUser(id: number): Promise<void> {
    await delay();
    
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw {
        message: 'Usuario no encontrado',
        errors: {},
      };
    }
    
    const userToDelete = users[userIndex];
    
    // No permitir eliminar al admin principal
    if (userToDelete && userToDelete.email === 'admin@blink.com') {
      throw {
        message: 'No se puede eliminar al administrador principal',
        errors: {},
      };
    }
    
    users.splice(userIndex, 1);
    saveUsers(users);
  },

  /**
   * Buscar usuarios por nombre o email
   */
  async searchUsers(query: string): Promise<User[]> {
    await delay();
    
    const users = loadUsers();
    const q = query.toLowerCase();
    
    const filtered = users.filter(user =>
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q))
    );
    
    return filtered.map(toPublicUser);
  },
};
