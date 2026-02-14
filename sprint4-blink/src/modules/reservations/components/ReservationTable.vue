<template>
  <BaseTable 
    :columns="columns" 
    :data="reservations" 
    :loading="loading" 
    :loadingText="$t('reservations.loading')"
    :emptyText="$t('reservations.empty')"
  >
    <!-- ID -->
    <template #cell-reservation_id="{ value }">
      <div class="text-sm font-medium text-gray-900">#{{ value }}</div>
    </template>

    <!-- Usuario -->
    <template #cell-user="{ item }">
      <div class="text-sm">
        <div class="font-medium text-gray-900">{{ item.user.name }}</div>
        <div class="text-gray-500 text-xs">{{ item.user.email }}</div>
      </div>
    </template>

    <!-- Vehículo -->
    <template #cell-vehicle="{ item }">
      <div class="text-sm">
        <div class="font-medium text-gray-900">
          {{ item.vehicle.brand }} {{ item.vehicle.model }}
        </div>
        <div class="text-gray-500 text-xs">{{ item.vehicle.license_plate }}</div>
      </div>
    </template>

    <!-- Fecha inicio -->
    <template #cell-start_date="{ value }">
      <div class="text-sm text-gray-900">{{ formatDateTime(value) }}</div>
    </template>

    <!-- Fecha fin -->
    <template #cell-end_date="{ value }">
      <div class="text-sm text-gray-900">{{ formatDateTime(value) }}</div>
    </template>

    <!-- Duración -->
    <template #cell-duration="{ item }">
      <div class="text-sm text-gray-600 font-medium">
        {{ calculateDuration(item.start_date, item.end_date) }}
      </div>
    </template>

    <!-- Ubicaciones -->
    <template #cell-locations="{ item }">
      <div class="text-xs text-gray-600">
        <div class="flex items-center gap-1">
          <span class="text-green-600">📍</span>
          <span class="truncate max-w-[150px]">{{ item.pickup_location }}</span>
        </div>
        <div class="flex items-center gap-1 mt-1">
          <span class="text-red-600">📍</span>
          <span class="truncate max-w-[150px]">{{ item.dropoff_location }}</span>
        </div>
      </div>
    </template>

    <!-- Costo total -->
    <template #cell-total_cost="{ value }">
      <div class="text-sm font-semibold text-gray-900">€{{ value }}</div>
    </template>

    <!-- Estado -->
    <template #cell-status="{ value }">
      <span 
        class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
        :class="getStatusBadgeClass(value)"
      >
        {{ $t(`reservations.status.${value}`) }}
      </span>
    </template>

    <!-- Acciones -->
    <template #cell-actions="{ item }">
      <div class="flex gap-2 justify-end">
        <!-- Botón editar -->
        <button
          @click="$emit('edit', item)"
          class="p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
          :title="$t('common.edit')"
        >
          <PencilIcon class="w-5 h-5" />
        </button>

        <!-- Botón eliminar -->
        <button
          @click="$emit('delete', item)"
          class="p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
          :title="$t('common.delete')"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { BaseTable } from '@/components/base';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Reservation, ReservationStatus } from '../types/reservation.types';
import type { TableColumn } from '@/components/base/BaseTable.vue';

interface Props {
  reservations?: Reservation[];
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  reservations: () => [],
  loading: false,
});

const { t, locale } = useI18n();

const emit = defineEmits<{
  edit: [reservation: Reservation];
  delete: [reservation: Reservation];
}>();

const columns = computed<TableColumn[]>(() => [
  { key: 'reservation_id', label: 'ID', align: 'left' },
  { key: 'user', label: t('reservations.table.user'), align: 'left' },
  { key: 'vehicle', label: t('reservations.table.vehicle'), align: 'left' },
  { key: 'start_date', label: t('reservations.table.startDate'), align: 'left' },
  { key: 'end_date', label: t('reservations.table.endDate'), align: 'left' },
  { key: 'duration', label: t('reservations.table.duration'), align: 'left' },
  { key: 'locations', label: t('reservations.table.locations'), align: 'left' },
  { key: 'total_cost', label: t('reservations.table.totalCost'), align: 'left' },
  { key: 'status', label: t('reservations.table.status'), align: 'left' },
  { key: 'actions', label: t('reservations.table.actions'), align: 'right' },
]);

const dateFormatter = computed(() => {
  const localeMap: Record<string, string> = {
    ca: 'ca-ES',
    es: 'es-ES',
    en: 'en-GB',
  };
  const intlLocale = localeMap[String(locale.value)] ?? 'ca-ES';

  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

const formatDateTime = (date: string): string => {
  return dateFormatter.value.format(new Date(date));
};

const calculateDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const diffMs = end - start;
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 
      ? `${days}d ${remainingHours}h`
      : `${days}d`;
  }
  
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const getStatusBadgeClass = (status: ReservationStatus): string => {
  const classes: Record<ReservationStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
</script>
