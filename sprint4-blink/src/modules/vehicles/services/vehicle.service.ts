import { apiClient } from '@/shared/services/api.service';
import type {
  Vehicle,
  CreateVehicleData,
  UpdateVehicleData,
  VehiclesResponse,
} from '../types/vehicle.types';

// Constants per al càlcul de nivell de bateria
const BATTERY_STORAGE_KEY = 'vehicle_battery_levels';
const BATTERY_MIN_LEVEL = 20; // Nivell mínim de bateria inicial (20%)
const BATTERY_MAX_LEVEL = 100; // Nivell màxim de bateria (100%)
const BATTERY_SEED_MULTIPLIER = 17; // Multiplicador per generar valors pseudo-aleatoris
const BATTERY_RANGE = BATTERY_MAX_LEVEL - BATTERY_MIN_LEVEL + 1; // 81 (rang de 20 a 100)

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
  
  try {
    const levels = getBatteryLevels();
    levels[vehicleId] = level;
    localStorage.setItem(BATTERY_STORAGE_KEY, JSON.stringify(levels));
  } catch (error) {
    // Gestionar errors de localStorage (QuotaExceededError, etc.)
    console.warn('Error guardant el nivell de bateria al localStorage:', error);
  }
};

const getBatteryLevel = (vehicleId: number): number | undefined => {
  const levels = getBatteryLevels();
  return levels[vehicleId];
};

/**
 * Genera un nivell de bateria inicial consistent per un vehicle.
 * Utilitza el vehicleId com a seed per generar sempre el mateix valor per cada vehicle.
 * 
 * @param vehicleId - ID del vehicle
 * @returns Nivell de bateria entre 20% i 100%
 * 
 * Formula: BATTERY_MIN_LEVEL + (vehicleId * BATTERY_SEED_MULTIPLIER) % BATTERY_RANGE
 * Això genera un valor pseudo-aleatori però consistent per cada vehicle.
 */
const generateInitialBatteryLevel = (vehicleId: number): number => {
  return BATTERY_MIN_LEVEL + (vehicleId * BATTERY_SEED_MULTIPLIER) % BATTERY_RANGE;
};

/**
 * Mapeja un vehicle de l'API al format intern, gestionant el battery_level.
 * 
 * @param vehicle - Vehicle rebut de l'API
 * @returns Vehicle amb id i battery_level normalitzats
 * 
 * Prioritat per battery_level:
 * 1. Valor de l'API (si existeix)
 * 2. localStorage (si s'ha guardat prèviament)
 * 3. Valor generat consistent basat en vehicleId
 */
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
      // Generar valor inicial consistent basat en el vehicleId
      batteryLevel = generateInitialBatteryLevel(vehicleId);
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

export const vehicleService = {
  /**
   * Obtener lista de vehículos
   */
  async getVehicles(page: number = 1, perPage: number = 5): Promise<VehiclesResponse> {
    const response = await apiClient.get<any>(`/vehicles?page=${page}&per_page=${perPage}`);
    
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
    const response = await apiClient.post<any>('/vehicles', data);
    
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
    
    const response = await apiClient.put<any>(`/vehicles/${id}`, data);
    
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
    await apiClient.delete(`/vehicles/${id}`);
  },

  /**
   * Buscar vehículos
   */
  async searchVehicles(query: string): Promise<VehiclesResponse> {
    const response = await apiClient.get<any>(`/vehicles/search?query=${query}`);
    
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
