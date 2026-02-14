<template>
  <AppLayout :title="$t('reservations.title')">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <p class="mt-2 text-sm text-gray-600">
              {{ $t('reservations.description') }}
            </p>
          </div>
          <BaseButton @click="handleRefresh" variant="secondary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ $t('common.refresh') }}
          </BaseButton>
        </div>
      </div>

      <!-- Filtros rápidos por estado y búsqueda -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow space-y-4">
        <!-- Buscador -->
        <div class="flex gap-4">
          <div class="flex-1">
            <BaseInput 
              v-model="searchQuery" 
              type="text" 
              :placeholder="$t('reservations.searchPlaceholder')"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Filtros de estado -->
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
              v-if="status === 'all'" 
              class="ml-2 px-2 py-0.5 text-xs rounded-full"
              :class="selectedStatus === status ? 'bg-blue-500' : 'bg-gray-200'"
            >
              {{ reservations.length }}
            </span>
            <span 
              v-else
              class="ml-2 px-2 py-0.5 text-xs rounded-full"
              :class="selectedStatus === status ? 'bg-blue-500' : 'bg-gray-200'"
            >
              {{ getStatusCount(status) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tabla de reservas -->
      <ReservationTable 
        :reservations="filteredReservations" 
        :loading="loading" 
        @edit="openEditModal"
        @delete="openDeleteModal"
      />

      <!-- Modal de Editar Reserva -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title"
            role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <!-- Overlay -->
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeEditModal" />

              <!-- Center modal -->
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <!-- Modal panel -->
              <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {{ $t('reservations.actions.editReservation') }}
                  </h3>
                  <ReservationForm 
                    :reservation="editingReservation" 
                    :loading="submitting" 
                    :errors="formErrors"
                    @submit="handleSubmit"
                    @cancel="closeEditModal" 
                  />
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Modal de Confirmación de Eliminación -->
      <BaseModal 
        :show="showDeleteModal" 
        :title="$t('reservations.modal.deleteTitle')"
        :message="$t('reservations.modal.deleteMessage', { id: reservationToDelete?.reservation_id ?? '' })" 
        type="danger"
        :confirm-text="$t('common.delete')" 
        :cancel-text="$t('common.cancel')" 
        :loading="deleting"
        @confirm="handleDelete" 
        @close="closeDeleteModal" 
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { BaseButton, BaseModal, BaseInput } from '@/components/base';
import AppLayout from '@/layouts/AppLayout.vue';
import ReservationTable from '@/modules/reservations/components/ReservationTable.vue';
import ReservationForm from '@/modules/reservations/components/ReservationForm.vue';
import { reservationService } from '@/modules/reservations/services/reservation.service';
import type { Reservation, ReservationStatus, UpdateReservationStatusData } from '@/modules/reservations/types/reservation.types';
import { useToast } from '@/shared/composables/useToast';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t } = useI18n();

// Estado
const reservations = ref<Reservation[]>([]);
const allReservations = ref<Reservation[]>([]);
const loading = ref(false);
const deleting = ref(false);
const submitting = ref(false);
const selectedStatus = ref<string>('all');
const searchQuery = ref('');

// Modales
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const reservationToDelete = ref<Reservation | null>(null);
const editingReservation = ref<Reservation | null>(null);

// Errores del formulario
const formErrors = ref<Record<string, string>>({});

const statusOptions: ReservationStatus[] = ['pending', 'active', 'completed', 'cancelled'];

// Cargar reservas
const loadReservations = async () => {
  loading.value = true;
  try {
    const data = await reservationService.getReservations();
    allReservations.value = data;
    reservations.value = data;
    
    // Ordenar por fecha más reciente primero
    reservations.value.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    allReservations.value.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } catch (error: any) {
    toast.error(error?.message || t('reservations.errors.load'));
  } finally {
    loading.value = false;
  }
};

// Filtrar por estado
const filteredReservations = computed(() => {
  if (selectedStatus.value === 'all') {
    return reservations.value;
  }
  return reservations.value.filter(r => r.status === selectedStatus.value);
});

const filterByStatus = (status: string) => {
  selectedStatus.value = status;
};

const getStatusCount = (status: string): number => {
  return reservations.value.filter(r => r.status === status).length;
};

// Refrescar reservas
const handleRefresh = () => {
  selectedStatus.value = 'all';
  searchQuery.value = '';
  loadReservations();
};

// Búsqueda
let searchTimeout: ReturnType<typeof setTimeout>;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      reservations.value = allReservations.value.filter(r => 
        r.user.name.toLowerCase().includes(query) ||
        r.user.email.toLowerCase().includes(query) ||
        r.vehicle.brand.toLowerCase().includes(query) ||
        r.vehicle.model.toLowerCase().includes(query) ||
        r.vehicle.license_plate.toLowerCase().includes(query) ||
        r.pickup_location.toLowerCase().includes(query) ||
        r.dropoff_location.toLowerCase().includes(query)
      );
    } else {
      reservations.value = [...allReservations.value];
    }
  }, 300);
};

// Abrir modal de editar
const openEditModal = (reservation: Reservation) => {
  editingReservation.value = reservation;
  formErrors.value = {};
  showEditModal.value = true;
};

// Cerrar modal de editar
const closeEditModal = () => {
  showEditModal.value = false;
  editingReservation.value = null;
  formErrors.value = {};
};

// Manejar envío del formulario
const handleSubmit = async (data: UpdateReservationStatusData) => {
  if (!editingReservation.value) return;

  submitting.value = true;
  formErrors.value = {};

  try {
    await reservationService.updateStatus(editingReservation.value.reservation_id, data);
    toast.success(t('reservations.toast.statusUpdated'));
    closeEditModal();
    await loadReservations();
  } catch (error: any) {
    if (error.errors) {
      formErrors.value = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key][0];
        return acc;
      }, {} as Record<string, string>);
    }
    toast.error(error?.message || t('reservations.errors.updateStatus'));
  } finally {
    submitting.value = false;
  }
};

// Abrir modal de eliminar
const openDeleteModal = (reservation: Reservation) => {
  reservationToDelete.value = reservation;
  showDeleteModal.value = true;
};

// Cerrar modal de eliminar
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  reservationToDelete.value = null;
};

// Manejar eliminación
const handleDelete = async () => {
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
