<template>
  <AppLayout :title="$t('reservations.title')">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <p class="mt-2 text-sm text-gray-600">
          {{ $t('reservations.description') }}
        </p>
      </div>

      <!-- Filtres ràpids per estat -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="status in ['all', ...statusOptions]"
            :key="status"
            @click="filterByStatus(status)"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="selectedStatus === status 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ status === 'all' ? $t('reservations.filters.all') : $t(`reservations.status.${status}`) }}
            <span 
              class="ml-2 px-2 py-0.5 text-xs rounded-full"
              :class="selectedStatus === status ? 'bg-blue-500' : 'bg-gray-200'"
            >
              {{ status === 'all' ? allReservations.length : getStatusCount(status) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Taula de reserves -->
      <BaseTable 
        :columns="columns" 
        :data="filteredReservations" 
        :loading="loading"
        :loadingText="$t('reservations.loading')"
        :emptyText="$t('reservations.empty')"
      >
        <!-- Usuari -->
        <template #cell-user="{ item }">
          <div class="text-sm">
            <div class="font-medium text-gray-900">
              {{ item.user?.name || 'Usuari desconegut' }}
            </div>
            <div class="text-gray-500 text-xs">{{ item.user?.email || '-' }}</div>
          </div>
        </template>

        <!-- Vehicle -->
        <template #cell-vehicle="{ item }">
          <div class="text-sm">
            <div class="font-medium text-gray-900">
              {{ item.vehicle.brand }} {{ item.vehicle.model }}
            </div>
            <div class="text-gray-500 text-xs">{{ item.vehicle.license_plate }}</div>
          </div>
        </template>

        <!-- Data inici -->
        <template #cell-start_date="{ value }">
          <div class="text-sm text-gray-900">{{ formatDateTime(value) }}</div>
        </template>

        <!-- Data fi -->
        <template #cell-end_date="{ value }">
          <div class="text-sm text-gray-900">{{ formatDateTime(value) }}</div>
        </template>

        <!-- Ubicacions -->
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

        <!-- Cost -->
        <template #cell-total_cost="{ value }">
          <div class="text-sm font-semibold text-gray-900">€{{ value }}</div>
        </template>

        <!-- Estat -->
        <template #cell-status="{ value }">
          <span 
            class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
            :class="getStatusBadgeClass(value)"
          >
            {{ $t(`reservations.status.${value}`) }}
          </span>
        </template>

        <!-- Accions -->
        <template #cell-actions="{ item }">
          <div class="flex gap-2 justify-end">
            <button
              @click="openDeleteModal(item)"
              class="p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              :title="$t('reservations.actions.delete')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </template>
      </BaseTable>

      <!-- Modal eliminar reserva -->
      <BaseModal 
        :show="showDeleteModal" 
        :title="$t('reservations.modal.deleteTitle')"
        :message="$t('reservations.modal.deleteMessage', { id: reservationToDelete?.reservation_id })" 
        type="danger"
        :confirm-text="$t('reservations.actions.delete')" 
        :cancel-text="$t('common.cancel')" 
        :loading="deleting"
        @confirm="handleDeleteReservation" 
        @close="closeDeleteModal" 
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { BaseModal, BaseTable } from '@/components/base';
import AppLayout from '@/layouts/AppLayout.vue';
import { reservationService } from '@/modules/reservations/services/reservation.service';
import type { Reservation, ReservationStatus } from '@/modules/reservations/types/reservation.types';
import type { TableColumn } from '@/components/base/BaseTable.vue';
import { useToast } from '@/shared/composables/useToast';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t, locale } = useI18n();

// Estat
const allReservations = ref<Reservation[]>([]);
const loading = ref(false);
const deleting = ref(false);
const selectedStatus = ref<string>('all');

// Modals
const showDeleteModal = ref(false);
const reservationToDelete = ref<Reservation | null>(null);

const statusOptions: ReservationStatus[] = ['pending', 'active', 'completed', 'cancelled'];

const columns = computed<TableColumn[]>(() => [
  { key: 'user', label: t('reservations.table.user'), align: 'left' },
  { key: 'vehicle', label: t('reservations.table.vehicle'), align: 'left' },
  { key: 'start_date', label: t('reservations.table.startDate'), align: 'left' },
  { key: 'end_date', label: t('reservations.table.endDate'), align: 'left' },
  { key: 'locations', label: t('reservations.table.locations'), align: 'left' },
  { key: 'total_cost', label: t('reservations.table.totalCost'), align: 'left' },
  { key: 'status', label: t('reservations.table.status'), align: 'left' },
  { key: 'actions', label: t('reservations.table.actions'), align: 'right' },
]);

// Carregar totes les reserves (admin veu totes)
const loadReservations = async () => {
  loading.value = true;
  try {
    const data = await reservationService.getReservations();
    allReservations.value = data;
    
    allReservations.value.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } catch (error: any) {
    toast.error(error?.message || t('reservations.errors.load'));
  } finally {
    loading.value = false;
  }
};

// Filtrar per estat
const filteredReservations = computed(() => {
  if (selectedStatus.value === 'all') {
    return allReservations.value;
  }
  return allReservations.value.filter(r => r.status === selectedStatus.value);
});

const filterByStatus = (status: string) => {
  selectedStatus.value = status;
};

const getStatusCount = (status: string): number => {
  return allReservations.value.filter(r => r.status === status).length;
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

// Modals
const openDeleteModal = (reservation: Reservation) => {
  reservationToDelete.value = reservation;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  reservationToDelete.value = null;
};

const handleDeleteReservation = async () => {
  if (!reservationToDelete.value) return;

  deleting.value = true;
  try {
    await reservationService.deleteReservation(reservationToDelete.value.reservation_id);
    toast.success(t('reservations.toast.deleted'));
    closeDeleteModal();
    await loadReservations();
  } catch (error: any) {
    toast.error(error?.message || t('reservations.errors.delete'));
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  loadReservations();
});
</script>
