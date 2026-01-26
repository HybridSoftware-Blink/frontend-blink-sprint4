<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Vehicle {
  id: number;
  name: string;
  plate: string;
  lat: number;
  lng: number;
  status: 'active' | 'charging' | 'idle';
  battery: number;
}

interface Props {
  vehicles: Vehicle[];
}

const props = defineProps<Props>();

const map = ref<L.Map | null>(null);

// Funció per obtenir el color de la bateria
const getBatteryColor = (battery: number) => {
  if (battery > 60) return '#22c55e'; // verd
  if (battery > 30) return '#eab308'; // groc
  return '#ef4444'; // vermell
};

// Funció per crear icona de cotxe personalitzada
const createCarIcon = (status: string) => {
  const colors = {
    active: '#22c55e',   // verd - en moviment
    charging: '#3b82f6', // blau - carregant
    idle: '#6b7280'      // gris - aturat
  };
  
  const color = colors[status as keyof typeof colors] || '#6b7280';
  
  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-car-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

onMounted(() => {
  // Inicialitzar el mapa centrat a Amposta
  map.value = L.map('map', {
    minZoom: 6,   // Zoom mínim per veure tota Espanya
    maxZoom: 19   // Zoom màxim
  }).setView([40.7095, 0.5789], 15);

  // Capa base d'OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map.value);

  // Afegir marcadors dels vehicles amb icones personalitzades
  props.vehicles.forEach(vehicle => {
    const marker = L.marker([vehicle.lat, vehicle.lng], {
      icon: createCarIcon(vehicle.status)
    }).addTo(map.value!);
    
    const batteryColor = getBatteryColor(vehicle.battery);
    const statusText = vehicle.status === 'active' ? 'En moviment' : 
                       vehicle.status === 'charging' ? 'Carregant' : 'Aturat';
    
    // Popup amb informació del vehicle
    marker.bindPopup(`
      <div style="min-width: 200px; padding: 8px;">
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px;">${vehicle.name}</div>
        <div style="margin-bottom: 4px;">
          <strong>Matrícula:</strong> ${vehicle.plate}
        </div>
        <div style="margin-bottom: 8px;">
          <strong>Estat:</strong> <span style="color: ${getBatteryColor(vehicle.battery)};">${statusText}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <strong>Bateria:</strong>
          <div style="flex: 1; height: 20px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${vehicle.battery}%; background: ${batteryColor}; transition: all 0.3s;"></div>
          </div>
          <span style="font-weight: 600; color: ${batteryColor};">${vehicle.battery}%</span>
        </div>
      </div>
    `);
  });

  // Ajustar el mapa quan canvia la mida de la finestra
  setTimeout(() => {
    map.value?.invalidateSize();
  }, 100);
});

onUnmounted(() => {
  map.value?.remove();
});
</script>

<template>
  <div id="map" class="w-full h-full"></div>
</template>

<style scoped>
#map {
  z-index: 0;
}

/* Assegurar que el mapa es vegi correctament */
:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
}

/* Eliminar background de les icones personalitzades */
:deep(.custom-car-icon) {
  background: none !important;
  border: none !important;
}

/* Personalitzar els popups de Leaflet */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  padding: 0;
}

:deep(.leaflet-popup-content) {
  margin: 0;
  font-family: inherit;
}

:deep(.leaflet-popup-tip) {
  background: white;
}
</style>
