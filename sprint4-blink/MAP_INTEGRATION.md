# MapLibre Integration Guide

## 📍 Overview

El component `MapLibreMap.vue` permet visualitzar vehicles i geofences en un mapa interactiu utilitzant MapLibre GL.

## 🚀 Setup

### 1. Dependencies (Already Installed)
```bash
npm install maplibre-gl @types/maplibre-gl
```

### 2. Environment Variables

Crea o edita el fitxer `.env` amb les teves claus de MapTiler:

```env
VITE_MAPTILER_STYLE_URL=https://api.maptiler.com/maps/streets/style.json
VITE_MAPTILER_KEY=YOUR_MAPTILER_API_KEY
```

**Obtenir la clau API gratuïta:**
1. Visita https://www.maptiler.com/cloud/
2. Crea un compte gratuït
3. Copia la teva API Key
4. Enganxa-la al fitxer `.env`

## 📦 Component Usage

### Basic Example - Vehicle Map

```vue
<template>
  <div class="h-96">
    <MapLibreMap
      ref="mapRef"
      :vehicles="vehiclesWithLocation"
      :showGeofences="false"
      @loaded="onMapLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MapLibreMap from '@/layouts/components/MapLibreMap.vue';
import { vehicleService } from '@/modules/vehicles/services/vehicle.service';
import { useVehicleLocation } from '@/modules/vehicles/composables/useVehicleLocation';

const mapRef = ref<InstanceType<typeof MapLibreMap>>();
const { addRandomLocations } = useVehicleLocation();
const vehiclesWithLocation = ref([]);

onMounted(async () => {
  const response = await vehicleService.getVehicles();
  // Afegir ubicacions aleatòries per testing (o usar dades reals de l'API)
  vehiclesWithLocation.value = addRandomLocations(response.data);
});

const onMapLoaded = () => {
  console.log('Map loaded!');
  // Opcionalment, fer zoom a tots els vehicles
  mapRef.value?.fitToAllVehicles();
};
</script>
```

## 🎯 Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vehicles` | `Array` | `[]` | Array de vehicles amb `latitude`, `longitude`, `label` |
| `geofences` | `Array` | `[]` | Array de geofences (zones poligonals/circulars) |
| `showGeofences` | `Boolean` | `true` | Mostrar o amagar geofences |
| `styleUrl` | `String` | `VITE_MAPTILER_STYLE_URL` | URL de l'estil del mapa |
| `apiKey` | `String` | `VITE_MAPTILER_KEY` | Clau API de MapTiler |

## 📤 Component Events

- `@loaded`: Emès quan el mapa s'ha carregat completament
- `@map-click`: Emès quan es fa clic al mapa, retorna `{ lng, lat }`

## 🔧 Exposed Methods

```typescript
// Fer zoom a una ubicació específica
mapRef.value?.flyTo(longitude, latitude, zoom);

// Afegir marcador temporal
mapRef.value?.setSelectedMarker(longitude, latitude);

// Eliminar marcador temporal
mapRef.value?.removeSelectedMarker();

// Actualitzar vehicles dinàmicament
mapRef.value?.updateVehicles(newVehicleList);

// Fer zoom per veure tots els vehicles
mapRef.value?.fitToAllVehicles();
```

## 🗺️ Vehicle Data Format

Els vehicles necessiten les següents propietats per mostrar-se al mapa:

```typescript
interface VehicleWithLocation {
  id: number;
  latitude: number;      // Coordenada Y
  longitude: number;     // Coordenada X
  label?: string;        // Text del popup (opcional)
  // ... altres propietats del vehicle
}
```

**Exemple:**
```typescript
const vehicle = {
  id: 1,
  license_plate: "ABC1234",
  brand: "Tesla",
  model: "Model 3",
  latitude: 41.3851,   // Barcelona
  longitude: 2.1734,
  label: "Tesla Model 3 (ABC1234)"
};
```

## 🧪 Testing with Random Locations

Utilitza el composable `useVehicleLocation` per afegir ubicacions aleatòries:

```typescript
import { useVehicleLocation } from '@/modules/vehicles/composables/useVehicleLocation';

const { addRandomLocations } = useVehicleLocation();
const vehiclesWithLocation = addRandomLocations(vehicles); // Ubicacions al voltant de Barcelona
```

## 🌍 Real Location Data

Per utilitzar dades reals de ubicació:

1. **Assegura't que la teva API retorna** `latitude` i `longitude` per cada vehicle
2. **O emmagatzema les coordenades** a la base de dades
3. **O utilitza un servei de geocoding** per convertir adreces a coordenades

```typescript
// Exemple amb dades reals de l'API
const response = await vehicleService.getVehicles();
const vehiclesWithLocation = response.data.map(vehicle => ({
  ...vehicle,
  label: `${vehicle.brand} ${vehicle.model} (${vehicle.license_plate})`
}));
```

## 🎨 Customization

### Change Map Style

```vue
<MapLibreMap
  styleUrl="https://api.maptiler.com/maps/basic/style.json"
  :vehicles="vehicles"
/>
```

**Available styles:**
- `streets` - Estil per defecte amb carrers
- `basic` - Estil minimalista
- `satellite` - Vista satèl·lit
- `hybrid` - Satèl·lit amb etiquetes

### Custom Marker Colors

Edita `MapLibreMap.vue` per canviar els colors:

```typescript
// Vehicles (línia ~130)
const m = new maplibregl.Marker({ color: '#10b981' }) // Verde

// Geofences (línia ~78)
const m = new maplibregl.Marker({ color: '#3b82f6' }) // Azul
```

## 🔄 Integration with Vehicles Module

Per integrar el mapa a la vista de vehicles existent:

1. **Afegir botó "Veure al mapa"** a `VehicleTable.vue`
2. **Crear modal amb el mapa** a `VehiclesView.vue`
3. **Passar el vehicle seleccionat** al component MapLibreMap

Exemple complet disponible al README principal del projecte.

## 📝 Notes

- El fitxer `.env` NO es puja a Git (està a `.gitignore`)
- `.env.example` serveix com a plantilla per a altres desenvolupadors
- Les claus API gratuïtes de MapTiler tenen límits d'ús mensual
- Per producció, considera utilitzar variables d'entorn del servidor

## 🐛 Troubleshooting

**Mapa no es veu:**
- Verifica que `.env` tingui la clau API correcta
- Comprova la consola del navegador per errors
- Assegura't que el contenidor tingui altura definida (`h-96`, etc.)

**Vehicles no apareixen:**
- Confirma que els vehicles tinguin `latitude` i `longitude`
- Revisa que els valors siguin números vàlids
- Verifica que l'array no estigui buit

**Error de clau API:**
- La clau pot estar expirada o sense crèdits
- Crea una nova clau a MapTiler
- Actualitza `.env` i reinicia el servidor de desenvolupament
