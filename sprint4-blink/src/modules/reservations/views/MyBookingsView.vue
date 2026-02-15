<template>
  <AppLayout :title="$t('bookings.myBookings')">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <p class="mt-2 text-sm text-gray-600">
              {{ $t('bookings.description') }}
            </p>
          </div>
          <BaseButton @click="openNewBookingModal" variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ $t('bookings.actions.newBooking') }}
          </BaseButton>
        </div>
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
              {{ status === 'all' ? myBookings.length : getStatusCount(status) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Taula de les meves reserves -->
      <BaseTable 
        :columns="columns" 
        :data="filteredBookings" 
        :loading="loading"
        :loadingText="$t('reservations.loading')"
        :emptyText="$t('bookings.empty')"
      >
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
              v-if="item.status === 'pending'"
              @click="openCancelModal(item)"
              class="p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              :title="$t('bookings.actions.cancel')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </template>
      </BaseTable>

      <!-- Modal crear nova reserva -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showNewBookingModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeNewBookingModal" />
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {{ $t('bookings.actions.newBooking') }}
                  </h3>
                  <p class="text-sm text-gray-500 mb-4">
                    {{ $t('bookings.newBookingDescription') }}
                  </p>
                  <div class="flex justify-end space-x-3 pt-6 border-t">
                    <BaseButton type="button" variant="secondary" @click="closeNewBookingModal">
                      {{ $t('common.close') }}
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Modal cancel·lar reserva -->
      <BaseModal 
        :show="showCancelModal" 
        :title="$t('bookings.modal.cancelTitle')"
        :message="$t('bookings.modal.cancelMessage')" 
        type="danger"
        :confirm-text="$t('bookings.actions.confirmCancel')" 
        :cancel-text="$t('common.cancel')" 
        :loading="cancelling"
        @confirm="handleCancelBooking" 
        @close="closeCancelModal" 
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { BaseButton, BaseModal, BaseTable } from '@/components/base';
import AppLayout from '@/layouts/AppLayout.vue';
import { reservationService } from '@/modules/reservations/services/reservation.service';
import type { Reservation, ReservationStatus } from '@/modules/reservations/types/reservation.types';
import type { TableColumn } from '@/components/base/BaseTable.vue';
import { useToast } from '@/shared/composables/useToast';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t, locale } = useI18n();

// Estat
const myBookings = ref<Reservation[]>([]);
const loading = ref(false);
const cancelling = ref(false);
const selectedStatus = ref<string>('all');

// Modals
const showNewBookingModal = ref(false);
const showCancelModal = ref(false);
const bookingToCancel = ref<Reservation | null>(null);

const statusOptions: ReservationStatus[] = ['pending', 'active', 'completed', 'cancelled'];

const columns = computed<TableColumn[]>(() => [
  { key: 'vehicle', label: t('reservations.table.vehicle'), align: 'left' },
  { key: 'start_date', label: t('reservations.table.startDate'), align: 'left' },
  { key: 'end_date', label: t('reservations.table.endDate'), align: 'left' },
  { key: 'locations', label: t('reservations.table.locations'), align: 'left' },
  { key: 'total_cost', label: t('reservations.table.totalCost'), align: 'left' },
  { key: 'status', label: t('reservations.table.status'), align: 'left' },
  { key: 'actions', label: t('reservations.table.actions'), align: 'right' },
]);

// Carregar reserves de l'usuari
const loadMyBookings = async () => {
  loading.value = true;
  try {
    const data = await reservationService.getReservations();
    // TODO: Filtrar només les reserves de l'usuari actual
    myBookings.value = data;
    
    myBookings.value.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } catch (error: any) {
    toast.error(error?.message || t('reservations.errors.load'));
  } finally {
    loading.value = false;
  }
};

// Filtrar per estat
const filteredBookings = computed(() => {
  if (selectedStatus.value === 'all') {
    return myBookings.value;
  }
  return myBookings.value.filter(r => r.status === selectedStatus.value);
});

const filterByStatus = (status: string) => {
  selectedStatus.value = status;
};

const getStatusCount = (status: string): number => {
  return myBookings.value.filter(r => r.status === status).length;
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
const openNewBookingModal = () => {
  showNewBookingModal.value = true;
};

const closeNewBookingModal = () => {
  showNewBookingModal.value = false;
};

const openCancelModal = (booking: Reservation) => {
  bookingToCancel.value = booking;
  showCancelModal.value = true;
};

const closeCancelModal = () => {
  showCancelModal.value = false;
  bookingToCancel.value = null;
};

const handleCancelBooking = async () => {
  if (!bookingToCancel.value) return;

  cancelling.value = true;
  try {
    await reservationService.updateStatus(bookingToCancel.value.reservation_id, { status: 'cancelled' });
    toast.success(t('bookings.toast.cancelled'));
    closeCancelModal();
    await loadMyBookings();
  } catch (error: any) {
    toast.error(error?.message || t('bookings.errors.cancel'));
  } finally {
    cancelling.value = false;
  }
};

onMounted(() => {
  loadMyBookings();
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
