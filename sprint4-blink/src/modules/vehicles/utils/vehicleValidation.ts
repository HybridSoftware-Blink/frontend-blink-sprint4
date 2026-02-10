import type { ValidationErrors } from '@/shared/utils/validators';
import type { CreateVehicleData } from '../types/vehicle.types';

export function validateVehicleForm(
  data: Partial<CreateVehicleData>
): ValidationErrors {
  const errors: ValidationErrors = {};

  // License plate validation
  if (!data.license_plate) {
    errors.license_plate = 'validation.required';
  } else if (data.license_plate.length < 6 || data.license_plate.length > 10) {
    errors.license_plate = 'vehicles.validation.licensePlateLength';
  }

  // Brand validation
  if (!data.brand) {
    errors.brand = 'validation.required';
  } else if (data.brand.length < 2) {
    errors.brand = 'vehicles.validation.brandMinLength';
  }

  // Model validation
  if (!data.model) {
    errors.model = 'validation.required';
  } else if (data.model.length < 2) {
    errors.model = 'vehicles.validation.modelMinLength';
  }

  // Year validation
  if (!data.year) {
    errors.year = 'validation.required';
  } else {
    const currentYear = new Date().getFullYear();
    if (data.year < 2000 || data.year > currentYear + 1) {
      errors.year = 'vehicles.validation.yearRange';
    }
  }

  // Color validation
  if (!data.color) {
    errors.color = 'validation.required';
  }

  // Status validation
  if (!data.status) {
    errors.status = 'validation.required';
  }

  // Battery level validation (optional)
  if (data.battery_level !== undefined && data.battery_level !== null) {
    if (data.battery_level < 0 || data.battery_level > 100) {
      errors.battery_level = 'vehicles.validation.batteryRange';
    }
  }

  return errors;
}
