import { apiClient } from '@/shared/services/api.service';
import type { 
  Reservation, 
  UpdateReservationStatusData 
} from '../types/reservation.types';

export const reservationService = {
  /**
   * Obtener todas las reservas
   */
  async getReservations(): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>('/reservations');
    return response;
  },

  /**
   * Crear una nueva reserva
   */
  async createReservation(data: Partial<Reservation>): Promise<Reservation> {
    const response = await apiClient.post<Reservation>('/reservations', data);
    return response;
  },

  /**
   * Actualizar el estado de una reserva
   */
  async updateStatus(id: number, data: UpdateReservationStatusData): Promise<Reservation> {
    const response = await apiClient.patch<Reservation>(`/reservations/${id}/status`, data);
    return response;
  },

  /**
   * Actualizar el estado de una reserva (alias)
   */
  async updateReservationStatus(id: number, status: string): Promise<Reservation> {
    const response = await apiClient.patch<Reservation>(`/reservations/${id}/status`, { status });
    return response;
  },

  /**
   * Eliminar una reserva
   */
  async deleteReservation(id: number): Promise<void> {
    await apiClient.delete(`/reservations/${id}`);
  },
};
