import { apiClient } from '@/shared/services/api.service';
import type {
  Vehicle,
  CreateVehicleData,
  UpdateVehicleData,
  VehiclesResponse,
} from '../types/vehicle.types';

// LocalStorage key per guardar els nivells de bateria
const BATTERY_STORAGE_KEY = 'vehicle_battery_levels';

// Funcions auxiliars per gestionar battery_level
const getBatteryLevels = (): Record<number, number> => {
  try {
    const stored = localStorage.getItem(BATTERY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveBatteryLevel = (vehicleId: number, level: number | undefined) => {
  if (level === undefined) return;
  
  const levels = getBatteryLevels();
  levels[vehicleId] = level;
  localStorage.setItem(BATTERY_STORAGE_KEY, JSON.stringify(levels));
};

const getBatteryLevel = (vehicleId: number): number | undefined => {
  const levels = getBatteryLevels();
  return levels[vehicleId];
};

export const vehicleService = {
  /**
   * Obtener lista de vehículos
   */
  async getVehicles(page: number = 1, perPage: number = 5): Promise<VehiclesResponse> {
    const response = await apiClient.get<any>(`/v1/vehicles?page=${page}&per_page=${perPage}`);
    
    // Mapear vehicle_id a id y asegurar battery_level
    const mapVehicle = (vehicle: any): Vehicle => {
      const vehicleId = vehicle.id || vehicle.vehicle_id;
      
      // Prioritat: 1) API, 2) localStorage, 3) valor generat
      let batteryLevel = vehicle.battery_level;
      
      if (batteryLevel === undefined || batteryLevel === null) {
        // Intentar recuperar de localStorage
        const storedLevel = getBatteryLevel(vehicleId);
        
        if (storedLevel !== undefined) {
          batteryLevel = storedLevel;
        } else {
          // Generar valor inicial consistent
          batteryLevel = 20 + (vehicleId * 17) % 81;
          // Guardar el valor inicial
          saveBatteryLevel(vehicleId, batteryLevel);
        }
      }
      
      return {
        ...vehicle,
        id: vehicleId,
        battery_level: Number(batteryLevel),
      };
    };
    
    if (Array.isArray(response)) {
      return {
        data: response.map(mapVehicle),
      };
    } else if (response && typeof response === 'object' && 'data' in response) {
      return {
        data: response.data.map(mapVehicle),
        meta: response.meta,
      };
    }
    return { data: [] };
  },

  /**
   * Crear un nuevo vehículo
   */
  async createVehicle(data: CreateVehicleData): Promise<Vehicle> {
    const response = await apiClient.post<any>('/v1/vehicles', data);
    
    // L'API pot retornar directament l'objecte o dins de {data: ...}
    const vehicle = response.data ? response.data : response;
    const vehicleId = vehicle?.id || vehicle?.vehicle_id;
    
    // Guardar battery_level al localStorage
    if (data.battery_level !== undefined && vehicleId) {
      saveBatteryLevel(vehicleId, data.battery_level);
    }
    
    const storedLevel = vehicleId ? getBatteryLevel(vehicleId) : undefined;
    
    return {
      ...vehicle,
      id: vehicleId,
      battery_level: storedLevel ?? vehicle?.battery_level,
    };
  },

  /**
   * Actualizar un vehículo existente
   */
  async updateVehicle(id: number, data: UpdateVehicleData): Promise<Vehicle> {
    // Guardar battery_level al localStorage abans d'enviar
    if (data.battery_level !== undefined) {
      saveBatteryLevel(id, data.battery_level);
    }
    
    const response = await apiClient.put<any>(`/v1/vehicles/${id}`, data);
    
    // L'API pot retornar directament l'objecte o dins de {data: ...}
    const vehicle = response.data ? response.data : response;
    const storedLevel = getBatteryLevel(id);
    
    return {
      ...vehicle,
      id: vehicle?.id || vehicle?.vehicle_id || id,
      battery_level: storedLevel ?? vehicle?.battery_level,
    };
  },

  /**
   * Eliminar un vehículo
   */
  async deleteVehicle(id: number): Promise<void> {
    await apiClient.delete(`/v1/vehicles/${id}`);
  },

  /**
   * Buscar vehículos
   */
  async searchVehicles(query: string): Promise<VehiclesResponse> {
    const response = await apiClient.get<any>(`/v1/vehicles/search?query=${query}`);
    
    const mapVehicle = (vehicle: any): Vehicle => {
      const vehicleId = vehicle.id || vehicle.vehicle_id;
      
      let batteryLevel = vehicle.battery_level;
      
      if (batteryLevel === undefined || batteryLevel === null) {
        const storedLevel = getBatteryLevel(vehicleId);
        
        if (storedLevel !== undefined) {
          batteryLevel = storedLevel;
        } else {
          batteryLevel = 20 + (vehicleId * 17) % 81;
          saveBatteryLevel(vehicleId, batteryLevel);
        }
      }
      
      return {
        ...vehicle,
        id: vehicleId,
        battery_level: Number(batteryLevel),
      };
    };
    
    if (Array.isArray(response)) {
      return {
        data: response.map(mapVehicle),
      };
    } else if (response && typeof response === 'object' && 'data' in response) {
      return {
        data: response.data.map(mapVehicle),
        meta: response.meta,
      };
    }
    return { data: [] };
  },
};
