<template>
  <AppLayout :title="$t('map.title')">
    <div class="h-[calc(100vh-5rem)] overflow-hidden">
      <MapLibreMap
        ref="mapRef"
        :vehicles="vehiclesWithLocation"
        :showGeofences="false"
        @loaded="onMapLoaded"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import MapLibreMap from '@/layouts/components/MapLibreMap.vue';
import { vehicleService } from '@/modules/vehicles/services/vehicle.service';
import { useVehicleLocation } from '@/modules/vehicles/composables/useVehicleLocation';
import { getVehicleColorCode } from '@/modules/vehicles/utils/vehicleColors';
import { useToast } from '@/shared/composables/useToast';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toast = useToast();
const mapRef = ref<InstanceType<typeof MapLibreMap>>();
const { addRandomLocations } = useVehicleLocation();
const vehiclesWithLocation = ref<any[]>([]);
const loading = ref(false);

const loadVehicles = async () => {
  try {
    loading.value = true;
    const response = await vehicleService.getVehicles(1, 100); // Carregar tots els vehicles
    
    // Afegir ubicacions aleatòries i colors hexadecimals
    const vehiclesWithData = addRandomLocations(response.data).map(vehicle => ({
      ...vehicle,
      colorHex: getVehicleColorCode(vehicle.color), // Afegir color hexadecimal
    }));
    
    vehiclesWithLocation.value = vehiclesWithData;
    
    console.log(`${vehiclesWithLocation.value.length} vehicles carregats al mapa`);
  } catch (error) {
    console.error('Error carregant vehicles:', error);
    toast.error(t('map.errors.loadVehicles'));
  } finally {
    loading.value = false;
  }
};

const onMapLoaded = () => {
  console.log('Mapa carregat!');
  // Fer zoom automàtic per veure tots els vehicles
  if (vehiclesWithLocation.value.length > 0) {
    setTimeout(() => {
      mapRef.value?.fitToAllVehicles();
    }, 500);
  }
};

onMounted(() => {
  loadVehicles();
});
</script>
