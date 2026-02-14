<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Estado -->
    <div>
      <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('reservations.form.status') }}
      </label>
      <select
        id="status"
        v-model="formData.status"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.status }"
      >
        <option value="pending">{{ $t('reservations.status.pending') }}</option>
        <option value="active">{{ $t('reservations.status.active') }}</option>
        <option value="completed">{{ $t('reservations.status.completed') }}</option>
        <option value="cancelled">{{ $t('reservations.status.cancelled') }}</option>
      </select>
      <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
    </div>

    <!-- Usuario (read-only) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('reservations.table.user') }}
      </label>
      <div class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600">
        {{ reservation?.user.name }} ({{ reservation?.user.email }})
      </div>
    </div>

    <!-- Vehículo (read-only) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('reservations.table.vehicle') }}
      </label>
      <div class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600">
        {{ reservation?.vehicle.brand }} {{ reservation?.vehicle.model }} - {{ reservation?.vehicle.license_plate }}
      </div>
    </div>

    <!-- Fechas (read-only) -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('reservations.table.startDate') }}
        </label>
        <div class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600">
          {{ formatDateTime(reservation?.start_date || '') }}
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('reservations.table.endDate') }}
        </label>
        <div class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600">
          {{ formatDateTime(reservation?.end_date || '') }}
        </div>
      </div>
    </div>

    <!-- Ubicaciones (read-only) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('reservations.form.pickupLocation') }}
      </label>
      <div class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600">
        {{ reservation?.pickup_location }}
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('reservations.form.dropoffLocation') }}
      </label>
      <div class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600">
        {{ reservation?.dropoff_location }}
      </div>
    </div>

    <!-- Costo Total (read-only) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('reservations.table.totalCost') }}
      </label>
      <div class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600 font-semibold">
        €{{ reservation?.total_cost }}
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-end space-x-3 pt-6 border-t">
      <BaseButton type="button" variant="secondary" @click="$emit('cancel')" :disabled="loading">
        {{ $t('common.cancel') }}
      </BaseButton>
      <BaseButton type="submit" variant="primary" :disabled="loading">
        {{ loading ? $t('common.loading') : $t('common.save') }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { BaseButton } from '@/components/base';
import type { Reservation, UpdateReservationStatusData } from '../types/reservation.types';

interface Props {
  reservation?: Reservation | null;
  loading?: boolean;
  errors?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  reservation: null,
  loading: false,
  errors: () => ({}),
});

const emit = defineEmits<{
  submit: [data: UpdateReservationStatusData];
  cancel: [];
}>();

const { locale } = useI18n();

const formData = ref<UpdateReservationStatusData>({
  status: props.reservation?.status || 'pending',
});

const handleSubmit = () => {
  emit('submit', formData.value);
};

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
  if (!date) return '';
  return dateFormatter.value.format(new Date(date));
};
</script>
