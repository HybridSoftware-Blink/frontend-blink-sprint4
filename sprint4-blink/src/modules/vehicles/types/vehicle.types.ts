export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'inactive';

export interface Vehicle {
  id: number;
  vehicle_id?: number;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  status: VehicleStatus;
  battery_level?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleData {
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  status: VehicleStatus;
  battery_level?: number;
}

export interface UpdateVehicleData extends Partial<CreateVehicleData> {}

export interface VehiclesResponse {
  data: Vehicle[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface VehicleResponse {
  data: Vehicle;
}
