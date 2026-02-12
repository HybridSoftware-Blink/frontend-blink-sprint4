<template>
  <Transition name="sidebar">
    <div
      v-if="show && vehicle"
      class="absolute inset-y-0 left-0 z-10 w-80 bg-white shadow-2xl overflow-y-auto"
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ $t('vehicles.modal.detailsTitle') }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          :aria-label="$t('common.close')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 space-y-6">
        <!-- Matrícula -->
        <div class="border-b pb-4">
          <p class="text-sm font-medium text-gray-500 mb-1">
            {{ $t('vehicles.table.licensePlate') }}
          </p>
          <p class="text-lg text-gray-900 font-mono font-semibold">
            {{ vehicle.license_plate }}
          </p>
        </div>

        <!-- Marca i Model -->
        <div class="border-b pb-4">
          <p class="text-sm font-medium text-gray-500 mb-1">
            {{ $t('vehicles.table.brandModel') }}
          </p>
          <p class="text-base text-gray-900">
            {{ vehicle.brand }} {{ vehicle.model }}
          </p>
          <p class="text-sm text-gray-600">
            {{ $t('vehicles.form.year') }}: {{ vehicle.year }}
          </p>
        </div>

        <!-- Color -->
        <div class="border-b pb-4">
          <p class="text-sm font-medium text-gray-500 mb-2">
            {{ $t('vehicles.table.color') }}
          </p>
          <div class="flex items-center gap-3">
            <div
              class="size-10 rounded-full border-2 border-gray-300 shadow-sm"
              :style="{ backgroundColor: getVehicleColorCode(vehicle.color) }"
              :title="$t(`vehicles.colors.${vehicle.color}`)"
            />
            <p class="text-base text-gray-900">
              {{ $t(`vehicles.colors.${vehicle.color}`) }}
            </p>
          </div>
        </div>

        <!-- Estat -->
        <div class="border-b pb-4">
          <p class="text-sm font-medium text-gray-500 mb-2">
            {{ $t('vehicles.table.status') }}
          </p>
          <span
            class="inline-flex px-3 py-1 text-sm leading-5 font-semibold rounded-full"
            :class="getVehicleStatusClasses(vehicle.status)"
          >
            {{ $t(`vehicles.status.${vehicle.status}`) }}
          </span>
        </div>

        <!-- Bateria -->
        <div class="border-b pb-4">
          <p class="text-sm font-medium text-gray-500 mb-2">
            {{ $t('vehicles.table.battery') }}
          </p>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-gray-900">
                {{ vehicle.battery_level || 0 }}%
              </span>
              <span
                class="text-xs font-medium px-2 py-1 rounded"
                :class="{
                  'bg-green-100 text-green-800': (vehicle.battery_level || 0) >= 70,
                  'bg-yellow-100 text-yellow-800': (vehicle.battery_level || 0) >= 30 && (vehicle.battery_level || 0) < 70,
                  'bg-red-100 text-red-800': (vehicle.battery_level || 0) < 30,
                }"
              >
                {{ (vehicle.battery_level || 0) >= 70 ? $t('vehicles.battery.high') : 
                   (vehicle.battery_level || 0) >= 30 ? $t('vehicles.battery.medium') : 
                   $t('vehicles.battery.low') }}
              </span>
            </div>
            <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="getBatteryColorClass(vehicle.battery_level || 0)"
                :style="{ width: `${vehicle.battery_level || 0}%` }"
              />
            </div>
          </div>
        </div>

        <!-- Data de creació -->
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">
            {{ $t('vehicles.table.createdAt') }}
          </p>
          <p class="text-base text-gray-900">
            {{ formatDate(vehicle.created_at) }}
          </p>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Overlay (només dins del mapa) -->
  <Transition name="fade">
    <div
      v-if="show"
      class="absolute inset-0 bg-black bg-opacity-30 z-5"
      @click="$emit('close')"
    />
  </Transition>
</template>

<script setup lang="ts">
import type { Vehicle } from '@/modules/vehicles/types/vehicle.types';
import { getVehicleColorCode, getBatteryColorClass } from '@/modules/vehicles/utils/vehicleColors';
import { useDateFormatter } from '@/modules/vehicles/composables/useDateFormatter';

interface Props {
  show: boolean;
  vehicle: Vehicle | null;
}

const props = defineProps<Props>();
defineEmits<{
  (e: 'close'): void;
}>();

const { formatDate } = useDateFormatter();

const getVehicleStatusClasses = (status: string) => {
  const classes: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    in_use: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-gray-100 text-gray-800',
  };
  return classes[status] || classes.inactive;
};
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
