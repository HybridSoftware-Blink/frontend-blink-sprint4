import type { CreateUserData, UpdateUserData } from '../types/user.types';

export interface ValidationErrors {
  [key: string]: string | undefined;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  role?: string;
}

/**
 * Valida el nombre de usuario
 */
export function validateName(name: string | undefined): string | null {
  if (!name || !name.trim()) {
    return 'El nombre es requerido';
  }
  if (name.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  if (name.trim().length > 100) {
    return 'El nombre no puede exceder 100 caracteres';
  }
  return null;
}

/**
 * Valida el email
 */
export function validateEmail(email: string | undefined): string | null {
  if (!email || !email.trim()) {
    return 'El email es requerido';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El email no es válido';
  }
  
  if (email.length > 255) {
    return 'El email no puede exceder 255 caracteres';
  }
  
  return null;
}

/**
 * Valida el teléfono
 */
export function validatePhone(phone: string | undefined): string | null {
  if (!phone || !phone.trim()) {
    return 'El teléfono es requerido';
  }
  
  const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
  if (!phoneRegex.test(phone)) {
    return 'El teléfono no es válido';
  }
  
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 7) {
    return 'El teléfono debe tener al menos 7 dígitos';
  }
  
  return null;
}

/**
 * Valida la contraseña
 */
export function validatePassword(password: string | undefined, isEditing: boolean = false): string | null {
  if (!isEditing && (!password || !password.trim())) {
    return 'La contraseña es requerida';
  }
  
  if (password && password.trim().length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  
  if (password && password.trim().length > 255) {
    return 'La contraseña no puede exceder 255 caracteres';
  }
  
  return null;
}

/**
 * Valida la confirmación de contraseña
 */
export function validatePasswordConfirmation(
  password: string | undefined,
  passwordConfirmation: string | undefined,
  isEditing: boolean = false
): string | null {
  if (!isEditing && password && !passwordConfirmation) {
    return 'La confirmación de contraseña es requerida';
  }
  
  if (password !== passwordConfirmation) {
    return 'Las contraseñas no coinciden';
  }
  
  return null;
}

/**
 * Valida el rol
 */
export function validateRole(role: string | undefined): string | null {
  if (!role) {
    return 'El rol es requerido';
  }
  
  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role)) {
    return 'El rol no es válido';
  }
  
  return null;
}

/**
 * Valida todos los campos de creación de usuario
 */
export function validateUserForm(
  formData: CreateUserData | UpdateUserData,
  isEditing: boolean = false
): ValidationErrors {
  const errors: ValidationErrors = {};
  
  // Validaciones básicas
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;
  
  const roleError = validateRole(formData.role);
  if (roleError) errors.role = roleError;
  
  // Validaciones de contraseña
  const passwordData = formData as CreateUserData;
  if (passwordData.password !== undefined) {
    const passwordError = validatePassword(passwordData.password, isEditing);
    if (passwordError) errors.password = passwordError;
    
    const confirmError = validatePasswordConfirmation(
      passwordData.password,
      passwordData.password_confirmation || '',
      isEditing
    );
    if (confirmError) errors.password_confirmation = confirmError;
  }
  
  return errors;
}

/**
 * Valida si el formulario tiene errores
 */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(error => error !== undefined && error !== null && error !== '');
}
