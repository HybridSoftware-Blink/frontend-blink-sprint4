import { ref } from 'vue';
import type { Vehicle } from '../types/vehicle.types';

/**
 * Interface per a vehicles amb dades de ubicació per al mapa
 */
export interface VehicleWithLocation extends Vehicle {
  latitude?: number;
  longitude?: number;
  label?: string;
}

/**
 * Composable per gestionar vehicles amb ubicació al mapa
 * 
 * @example
 * const { vehiclesWithLocation, addLocationToVehicle } = useVehicleLocation();
 * addLocationToVehicle(vehicle, 41.3851, 2.1734); // Barcelona
 */
export const useVehicleLocation = () => {
  const vehiclesWithLocation = ref<VehicleWithLocation[]>([]);

  /**
   * Afegeix coordenades de ubicació a un vehicle
   * 
   * @param vehicle - Vehicle al qual afegir ubicació
   * @param latitude - Latitud (ex: 41.3851 per Barcelona)
   * @param longitude - Longitud (ex: 2.1734 per Barcelona)
   * @returns Vehicle amb ubicació afegida
   */
  const addLocationToVehicle = (
    vehicle: Vehicle,
    latitude: number,
    longitude: number
  ): VehicleWithLocation => {
    return {
      ...vehicle,
      latitude,
      longitude,
      label: `${vehicle.brand} ${vehicle.model} (${vehicle.license_plate})`,
    };
  };

  /**
   * Converteix una llista de vehicles afegint ubicacions aleatòries (per testing)
   * Ubicacions al voltant d'Amposta, Tarragona
   * 
   * @param vehicles - Llista de vehicles
   * @returns Vehicles amb ubicacions assignades
   */
  const addRandomLocations = (vehicles: Vehicle[]): VehicleWithLocation[] => {
    // Coordenades d'Amposta, Tarragona
    const ampostaLat = 40.7089;
    const ampostaLng = 0.5783;
    const radius = 0.02; // ~2km de radi

    return vehicles.map((vehicle) => {
      const randomLat = ampostaLat + (Math.random() - 0.5) * radius;
      const randomLng = ampostaLng + (Math.random() - 0.5) * radius;
      
      return addLocationToVehicle(vehicle, randomLat, randomLng);
    });
  };

  /**
   * Actualitza la llista de vehicles amb ubicació
   * 
   * @param vehicles - Nova llista de vehicles amb ubicació
   */
  const setVehiclesWithLocation = (vehicles: VehicleWithLocation[]) => {
    vehiclesWithLocation.value = vehicles;
  };

  return {
    vehiclesWithLocation,
    addLocationToVehicle,
    addRandomLocations,
    setVehiclesWithLocation,
  };
};
