<template>
  <BaseTable
    :columns="columns"
    :data="vehicles"
    :loading="loading"
    :loadingText="t('vehicles.loading')"
    :emptyText="t('vehicles.empty')"
  >
    <template #cell-license_plate="{ value }">
      <div class="text-sm font-medium text-gray-900">{{ value }}</div>
    </template>

    <template #cell-vehicle="{ item }">
      <div>
        <div class="font-medium text-gray-900">{{ item.brand }} {{ item.model }}</div>
        <div class="text-sm text-gray-500">{{ item.year }}</div>
      </div>
    </template>

    <template #cell-color="{ item }">
      <div class="flex items-center gap-2">
        <div
          class="size-6 rounded-full border border-gray-300"
          :style="{ backgroundColor: getVehicleColorCode(item.color) }"
          :title="t(`vehicles.colors.${item.color}`)"
        />
        <span class="text-sm text-gray-700">{{ t(`vehicles.colors.${item.color}`) }}</span>
      </div>
    </template>

    <template #cell-status="{ item }">
      <span :class="getVehicleStatusClasses(item.status, true)">
        {{ t(`vehicles.status.${item.status}`) }}
      </span>
    </template>

    <template #cell-battery_level="{ item }">
      <div v-if="isValidBatteryLevel(item.battery_level)" class="w-full">
        <div class="flex items-center gap-2">
          <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              :class="getBatteryColorClass(Number(item.battery_level))"
              :style="{ width: `${Number(item.battery_level)}%` }"
            />
          </div>
          <span class="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
            {{ Number(item.battery_level) }}%
          </span>
        </div>
      </div>
      <span v-else class="text-sm text-gray-400">-</span>
    </template>

    <template #cell-created_at="{ item }">
      <div class="text-sm text-gray-500">
        {{ formatDate(item.created_at) }}
      </div>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex gap-2 justify-end">
        <button
          @click="$emit('view', item)"
          class="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          :title="t('common.view')"
        >
          <EyeIcon class="w-5 h-5" />
        </button>
        <button
          @click="$emit('edit', item)"
          class="p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
          :title="t('common.edit')"
        >
          <PencilIcon class="w-5 h-5" />
        </button>
        <button
          @click="$emit('delete', item)"
          class="p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
          :title="t('common.delete')"
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
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Vehicle } from '../types/vehicle.types';
import { getVehicleColorCode, getBatteryColorClass, getVehicleStatusClasses } from '../utils/vehicleColors';
import { useDateFormatter } from '../composables/useDateFormatter';
import type { TableColumn } from '@/components/base/BaseTable.vue';

interface Props {
  vehicles: Vehicle[];
  loading?: boolean;
}

defineProps<Props>();

defineEmits<{
  view: [vehicle: Vehicle];
  edit: [vehicle: Vehicle];
  delete: [vehicle: Vehicle];
}>();

const { t } = useI18n();
const { formatDate } = useDateFormatter();

const columns = computed<TableColumn[]>(() => [
  { key: 'license_plate', label: t('vehicles.table.licensePlate'), align: 'left' },
  { key: 'vehicle', label: t('vehicles.table.brandModel'), align: 'left' },
  { key: 'color', label: t('vehicles.table.color'), align: 'left' },
  { key: 'status', label: t('vehicles.table.status'), align: 'left' },
  { key: 'battery_level', label: t('vehicles.table.battery'), align: 'left' },
  { key: 'created_at', label: t('vehicles.table.createdAt'), align: 'left' },
  { key: 'actions', label: t('vehicles.table.actions'), align: 'right' },
]);

const isValidBatteryLevel = (level: unknown): boolean => {
  if (level === null || level === undefined || level === '') return false;
  const num = Number(level);
  return Number.isFinite(num);
};
</script>
