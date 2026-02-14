import type { CreateTicketData } from '../types/ticket.types';
import type { ValidationErrors } from '@/shared/utils/validators';

export type { ValidationErrors } from '@/shared/utils/validators';

export function validateTicketForm(
  formData: CreateTicketData
): ValidationErrors {
  const errors: ValidationErrors = {};
  // Validar descripcion
  if (formData.descripcion) {
    if (typeof formData.descripcion !== 'string' || formData.descripcion.trim().length === 0) {
      errors.descripcion = 'validation.ticket.descripcionInvalid';
    } else if (formData.descripcion.length > 1000) {
      errors.descripcion = 'validation.ticket.descripcionMax';
    }
  }
  // Validar asunto (requerido)
  if (!formData.asunto || typeof formData.asunto !== 'string' || formData.asunto.trim().length === 0) {
    errors.asunto = 'validation.ticket.asuntoRequired';
  } else if (formData.asunto.length > 255) {
    errors.asunto = 'validation.ticket.asuntoMax';
  }

  // Validar fecha (opcional, si se proporciona debe ser válida)
  // fecha ya no se proporciona desde el formulario de usuario

  return errors;
}
