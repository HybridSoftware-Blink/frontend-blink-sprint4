/**
 * Tipos relacionados con reservas
 */

export type ReservationStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface Reservation {
  reservation_id: number;
  user_id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  pickup_location: string;
  dropoff_location: string;
  status: ReservationStatus;
  total_cost: string;
  created_at: string;
  updated_at: string;
  user: {
    user_id: number;
    name: string;
    email: string;
  };
  vehicle: {
    vehicle_id: number;
    license_plate: string;
    brand: string;
    model: string;
    status: string;
  };
}

export interface UpdateReservationStatusData {
  status: ReservationStatus;
}
