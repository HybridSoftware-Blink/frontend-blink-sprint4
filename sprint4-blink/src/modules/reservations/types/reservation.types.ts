import type { Vehicle } from '@/modules/vehicles/types/vehicle.types';

export type ReservationStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface User {
  user_id: number;
  name: string;
  email: string;
}

export interface Reservation {
  reservation_id: number;
  user_id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  pickup_location: string;
  dropoff_location: string;
  total_cost: string;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
  user?: User;
  vehicle: Vehicle;
}

export interface CreateReservationData {
  vehicle_id: number;
  start_date: string;
  end_date: string;
  pickup_location: string;
  dropoff_location: string;
  total_cost: string;
  status: ReservationStatus;
}

export interface UpdateReservationStatusData {
  status: ReservationStatus;
}
