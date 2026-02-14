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
    const response = await apiClient.get<Reservation[]>('/v1/reservations');
    return response;
  },

  /**
   * Actualizar el estado de una reserva
   */
  async updateStatus(id: number, data: UpdateReservationStatusData): Promise<Reservation> {
    const response = await apiClient.patch<Reservation>(`/v1/reservations/${id}/status`, data);
    return response;
  },

  /**
   * Eliminar una reserva
   */
  async deleteReservation(id: number): Promise<void> {
    await apiClient.delete(`/v1/reservations/${id}`);
  },
};
