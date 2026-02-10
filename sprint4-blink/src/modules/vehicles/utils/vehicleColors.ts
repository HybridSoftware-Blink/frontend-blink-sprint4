/**
 * Mapa de colors de vehicles amb els seus codis hexadecimals
 * Utilitzat per mostrar indicadors visuals de color a la interfície
 */
export const VEHICLE_COLOR_MAP: Record<string, string> = {
  // Colors bàsics
  'White': '#FFFFFF',
  'Black': '#000000',
  'Gray': '#6B7280',
  'Silver': '#C0C0C0',
  'Beige': '#D4A574',
  'Brown': '#92400E',
  
  // Colors càlids
  'Red': '#DC2626',
  'Orange': '#EA580C',
  'Yellow': '#EAB308',
  'Gold': '#F59E0B',
  'Pink': '#EC4899',
  'Burgundy': '#881337',
  
  // Colors freds
  'Green': '#16A34A',
  'Teal': '#14B8A6',
  'Cyan': '#06B6D4',
  'Blue': '#2563EB',
  'Navy': '#1E3A8A',
  'Purple': '#9333EA',
  'Violet': '#7C3AED',
  'Indigo': '#4F46E5',
  
  // Compatibilitat amb traduccions catalanes
  'Blanc': '#FFFFFF',
  'Negre': '#000000',
  'Gris': '#6B7280',
  'Plata': '#C0C0C0',
  'Beix': '#D4A574',
  'Marró': '#92400E',
  'Vermell': '#DC2626',
  'Taronja': '#EA580C',
  'Groc': '#EAB308',
  'Or': '#F59E0B',
  'Rosa': '#EC4899',
  'Borgonya': '#881337',
  'Verd': '#16A34A',
  'Turquesa': '#14B8A6',
  'Blau': '#2563EB',
  'Blau marí': '#1E3A8A',
  'Porpra': '#9333EA',
  'Violeta': '#7C3AED',
  
  // Compatibilitat amb traduccions espanyoles
  'Blanco': '#FFFFFF',
  'Negro': '#000000',
  'Gris oscuro': '#374151', // Evitar duplicat amb 'Gris' català
  'Marrón': '#92400E',
  'Rojo': '#DC2626',
  'Naranja': '#EA580C',
  'Amarillo': '#EAB308',
  'Oro': '#F59E0B',
  'Borgoña': '#881337',
  'Verde': '#16A34A',
  'Azul': '#2563EB',
  'Azul marino': '#1E3A8A',
  'Púrpura': '#9333EA',
};

/**
 * Color per defecte quan no es troba el color especificat
 */
export const DEFAULT_VEHICLE_COLOR = '#6B7280';

/**
 * Llindars de nivell de bateria per als indicadors de color
 */
export const BATTERY_LEVEL_THRESHOLDS = {
  HIGH: 70,    // >= 70% - Verd (bateria alta)
  MEDIUM: 30,  // >= 30% - Groc (bateria mitjana)
  // < 30% - Vermell (bateria baixa)
} as const;

/**
 * Classes de color Tailwind per als indicadors de bateria
 */
export const BATTERY_COLOR_CLASSES = {
  HIGH: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-red-500',
} as const;

/**
 * Obté la classe de color CSS basada en el nivell de bateria
 * @param level - Nivell de bateria (0-100)
 * @returns Classe CSS de Tailwind per al color de la bateria
 */
export const getBatteryColorClass = (level: number): string => {
  if (level >= BATTERY_LEVEL_THRESHOLDS.HIGH) return BATTERY_COLOR_CLASSES.HIGH;
  if (level >= BATTERY_LEVEL_THRESHOLDS.MEDIUM) return BATTERY_COLOR_CLASSES.MEDIUM;
  return BATTERY_COLOR_CLASSES.LOW;
};

/**
 * Obté el codi hexadecimal d'un color de vehicle
 * @param colorName - Nom del color (en qualsevol idioma suportat)
 * @returns Codi hexadecimal del color o el color per defecte si no es troba
 */
export const getVehicleColorCode = (colorName: string): string => {
  return VEHICLE_COLOR_MAP[colorName] || DEFAULT_VEHICLE_COLOR;
};

/**
 * Classes CSS de Tailwind per als estats dels vehicles
 * Versió simple per a badges bàsics
 */
export const VEHICLE_STATUS_CLASSES: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  in_use: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  reserved: 'bg-purple-100 text-purple-800',
  inactive: 'bg-gray-100 text-gray-800',
} as const;

/**
 * Classes CSS de Tailwind per als estats dels vehicles amb ring
 * Versió amb efecte ring per a la taula
 */
export const VEHICLE_STATUS_CLASSES_WITH_RING: Record<string, string> = {
  available: 'bg-green-50 text-green-700 ring-green-600/20',
  in_use: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  maintenance: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  reserved: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  inactive: 'bg-gray-50 text-gray-600 ring-gray-500/20',
} as const;

/**
 * Obté les classes CSS per a l'estat d'un vehicle
 * @param status - Estat del vehicle (available, in_use, maintenance, reserved, inactive)
 * @param withRing - Si és true, retorna classes amb efecte ring per a la taula
 * @returns Classes CSS de Tailwind per a l'estat
 */
export const getVehicleStatusClasses = (status: string, withRing: boolean = false): string => {
  if (withRing) {
    const baseClasses = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset';
    const statusClasses = (VEHICLE_STATUS_CLASSES_WITH_RING[status] || VEHICLE_STATUS_CLASSES_WITH_RING.inactive) as string;
    return `${baseClasses} ${statusClasses}`;
  }
  return (VEHICLE_STATUS_CLASSES[status] || VEHICLE_STATUS_CLASSES.inactive) as string;
};

/**
 * Llista de colors disponibles per al selector (en anglès com a claus)
 */
export const AVAILABLE_VEHICLE_COLORS = [
  'White',
  'Black',
  'Gray',
  'Silver',
  'Beige',
  'Brown',
  'Red',
  'Orange',
  'Yellow',
  'Gold',
  'Pink',
  'Burgundy',
  'Green',
  'Teal',
  'Blue',
  'Navy',
  'Purple',
  'Violet',
] as const;

export type VehicleColor = typeof AVAILABLE_VEHICLE_COLORS[number];
