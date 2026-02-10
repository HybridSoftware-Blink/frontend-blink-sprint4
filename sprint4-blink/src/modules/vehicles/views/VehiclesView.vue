<template>
  <AppLayout :title="$t('vehicles.title')">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <p class="mt-2 text-sm text-gray-600">
              {{ $t('vehicles.description') }}
            </p>
          </div>
          <BaseButton @click="openCreateModal" variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ $t('vehicles.actions.newVehicle') }}
          </BaseButton>
        </div>
      </div>

      <!-- Búsqueda y filtros -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
        <div class="flex gap-4">
          <div class="flex-1">
            <BaseInput
              v-model="searchQuery"
              type="text"
              :placeholder="$t('vehicles.searchPlaceholder')"
            />
          </div>
          <BaseButton @click="handleRefresh" variant="secondary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ $t('common.refresh') }}
          </BaseButton>
        </div>
      </div>

      <!-- Tabla de vehículos -->
      <VehicleTable
        :vehicles="vehicles"
        :loading="loading"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />

      <!-- Modal de Crear/Editar Vehículo -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showVehicleModal"
            class="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <!-- Overlay -->
              <div
                class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                @click="closeVehicleModal"
              />

              <!-- Center modal -->
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <!-- Modal panel -->
              <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
              >
                <div class="bg-white px-6 pt-6 pb-5 sm:p-8">
                  <h3 class="text-xl leading-6 font-semibold text-gray-900 mb-6">
                    {{ editingVehicle ? $t('vehicles.actions.editVehicle') : $t('vehicles.actions.createNewVehicle') }}
                  </h3>
                  <VehicleForm
                    :vehicle="editingVehicle"
                    :loading="submitting"
                    :errors="formErrors"
                    @submit="handleSubmit"
                    @cancel="closeVehicleModal"
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
        :title="$t('vehicles.modal.deleteTitle')"
        :message="$t('vehicles.modal.deleteMessage', { plate: vehicleToDelete?.license_plate ?? '' })"
        type="danger"
        :confirm-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
        :loading="deleting"
        @confirm="handleDelete"
        @close="closeDeleteModal"
      />

      <!-- Modal de Visualización de Vehículo -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showViewModal"
            class="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <!-- Overlay -->
              <div
                class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                @click="closeViewModal"
              />

              <!-- Center modal -->
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <!-- Modal panel -->
              <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {{ $t('vehicles.modal.detailsTitle') }}
                  </h3>
                  <div v-if="viewingVehicle" class="space-y-4">
                    <div class="border-b pb-4">
                      <p class="text-sm font-medium text-gray-500">{{ $t('vehicles.table.licensePlate') }}</p>
                      <p class="text-base text-gray-900 font-mono">{{ viewingVehicle.license_plate }}</p>
                    </div>
                    <div class="border-b pb-4">
                      <p class="text-sm font-medium text-gray-500">{{ $t('vehicles.table.brandModel') }}</p>
                      <p class="text-base text-gray-900">{{ viewingVehicle.brand }} {{ viewingVehicle.model }} ({{ viewingVehicle.year }})</p>
                    </div>
                    <div class="border-b pb-4">
                      <p class="text-sm font-medium text-gray-500">{{ $t('vehicles.table.color') }}</p>
                      <div class="flex items-center gap-2 mt-1">
                        <div
                          class="size-6 rounded-full border-2 border-gray-300"
                          :style="{ backgroundColor: getVehicleColorCode(viewingVehicle.color) }"
                          :title="$t(`vehicles.colors.${viewingVehicle.color}`)"
                        />
                        <p class="text-base text-gray-900">{{ $t(`vehicles.colors.${viewingVehicle.color}`) }}</p>
                      </div>
                    </div>
                    <div class="border-b pb-4">
                      <p class="text-sm font-medium text-gray-500">{{ $t('vehicles.table.status') }}</p>
                      <span class="inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full"
                        :class="getVehicleStatusClasses(viewingVehicle.status)">
                        {{ $t(`vehicles.status.${viewingVehicle.status}`) }}
                      </span>
                    </div>
                    <div class="border-b pb-4">
                      <p class="text-sm font-medium text-gray-500">{{ $t('vehicles.table.battery') }}</p>
                      <div class="flex items-center gap-2 mt-1">
                        <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all" 
                            :class="getBatteryColorClass(viewingVehicle.battery_level || 0)"
                            :style="{ width: `${viewingVehicle.battery_level || 0}%` }">
                          </div>
                        </div>
                        <span class="text-sm text-gray-600">{{ viewingVehicle.battery_level || 0 }}%</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">{{ $t('vehicles.table.createdAt') }}</p>
                      <p class="text-base text-gray-900">{{ formatDate(viewingVehicle.created_at) }}</p>
                    </div>
                  </div>
                  <div class="flex justify-end space-x-3 pt-6 border-t mt-6">
                    <BaseButton type="button" variant="secondary" @click="closeViewModal">
                      {{ $t('common.close') }}
                    </BaseButton>
                    <BaseButton type="button" variant="primary" @click="switchToEdit">
                      {{ $t('vehicles.actions.editVehicle') }}
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { BaseButton, BaseInput, BaseModal } from '@/components/base';
import AppLayout from '@/layouts/AppLayout.vue';
import VehicleTable from '@/modules/vehicles/components/VehicleTable.vue';
import VehicleForm from '@/modules/vehicles/components/VehicleForm.vue';
import { vehicleService } from '@/modules/vehicles/services/vehicle.service';
import type { Vehicle, CreateVehicleData, UpdateVehicleData } from '@/modules/vehicles/types/vehicle.types';
import { useToast } from '@/shared/composables/useToast';
import { validateVehicleForm } from '@/modules/vehicles/utils/vehicleValidation';
import { getVehicleColorCode, getBatteryColorClass, getVehicleStatusClasses } from '@/modules/vehicles/utils/vehicleColors';
import { useDateFormatter } from '@/modules/vehicles/composables/useDateFormatter';
import type { ValidationErrors } from '@/shared/utils/validators';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t, te } = useI18n();
const { formatDate } = useDateFormatter({
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const translateErrorMessage = (message: unknown, fallback: string) => {
  const msg = typeof message === 'string' ? message : '';
  if (msg && te(msg)) return t(msg);
  return msg || fallback;
};

// Estado
const allVehicles = ref<Vehicle[]>([]);
const vehicles = ref<Vehicle[]>([]);
const loading = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const searchQuery = ref('');

// Modales
const showVehicleModal = ref(false);
const showDeleteModal = ref(false);
const showViewModal = ref(false);
const editingVehicle = ref<Vehicle | null>(null);
const viewingVehicle = ref<Vehicle | null>(null);
const vehicleToDelete = ref<Vehicle | null>(null);

// Errores del formulario
const formErrors = ref<ValidationErrors>({});

// Cargar vehículos
const loadVehicles = async () => {
  loading.value = true;
  try {
    const response = await vehicleService.getVehicles(1, 100);
    
    let vehicleData: Vehicle[] = [];
    if (response && typeof response === 'object' && 'data' in response) {
      vehicleData = Array.isArray(response.data) ? response.data : [];
    } else if (Array.isArray(response)) {
      vehicleData = response;
    }
    
    allVehicles.value = vehicleData;
    vehicles.value = vehicleData;
  } catch (error: any) {
    toast.error(translateErrorMessage(error?.message, t('vehicles.errors.load')));
  } finally {
    loading.value = false;
  }
};

// Búsqueda local con debounce
let searchTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (newQuery.trim()) {
      const query = newQuery.toLowerCase();
      vehicles.value = allVehicles.value.filter(vehicle => 
        vehicle.license_plate.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.color.toLowerCase().includes(query) ||
        vehicle.status.toLowerCase().includes(query)
      );
    } else {
      vehicles.value = allVehicles.value;
    }
  }, 300);
});

// Netejar timeout quan es desmunta el component
onUnmounted(() => {
  clearTimeout(searchTimeout);
});

// Refrescar vehículos
const handleRefresh = () => {
  searchQuery.value = '';
  loadVehicles();
};

// Abrir modal de crear
const openCreateModal = () => {
  editingVehicle.value = null;
  formErrors.value = {};
  showVehicleModal.value = true;
};

// Abrir modal de editar
const openEditModal = (vehicle: Vehicle) => {
  editingVehicle.value = vehicle;
  formErrors.value = {};
  showVehicleModal.value = true;
};

// Abrir modal de visualización
const openViewModal = (vehicle: Vehicle) => {
  viewingVehicle.value = vehicle;
  showViewModal.value = true;
};

// Cerrar modal de visualización
const closeViewModal = () => {
  showViewModal.value = false;
  viewingVehicle.value = null;
};

// Cambiar a edición desde visualización
const switchToEdit = () => {
  if (viewingVehicle.value) {
    closeViewModal();
    openEditModal(viewingVehicle.value);
  }
};

// Cerrar modal de vehículo
const closeVehicleModal = () => {
  showVehicleModal.value = false;
  editingVehicle.value = null;
  formErrors.value = {};
};

// Abrir modal de eliminar
const openDeleteModal = (vehicle: Vehicle) => {
  vehicleToDelete.value = vehicle;
  showDeleteModal.value = true;
};

// Cerrar modal de eliminar
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  vehicleToDelete.value = null;
};

// Manejar envío del formulario con validación
const handleSubmit = async (data: CreateVehicleData | UpdateVehicleData) => {
  submitting.value = true;
  formErrors.value = {};
  
  // Validar datos antes de enviar
  const validationErrors = validateVehicleForm(data);
  if (Object.keys(validationErrors).length > 0) {
    formErrors.value = validationErrors;
    submitting.value = false;
    return;
  }
  
  try {
    if (editingVehicle.value) {
      await vehicleService.updateVehicle(editingVehicle.value.id, data as UpdateVehicleData);
      toast.success(t('vehicles.toast.updated'));
    } else {
      await vehicleService.createVehicle(data as CreateVehicleData);
      toast.success(t('vehicles.toast.created'));
    }
    
    closeVehicleModal();
    await loadVehicles();
  } catch (error: any) {
    if (error.errors) {
      formErrors.value = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key][0];
        return acc;
      }, {} as Record<string, string>);
    }
    toast.error(translateErrorMessage(error?.message, t('vehicles.errors.save')));
  } finally {
    submitting.value = false;
  }
};

// Manejar eliminación
const handleDelete = async () => {
  if (!vehicleToDelete.value) return;
  
  deleting.value = true;
  try {
    await vehicleService.deleteVehicle(vehicleToDelete.value.id);
    toast.success(t('vehicles.toast.deleted'));
    closeDeleteModal();
    await loadVehicles();
  } catch (error: any) {
    const errorMsg = error.status === 404 
      ? t('vehicles.errors.notFound')
      : (error.message || t('vehicles.errors.delete'));
    toast.error(errorMsg);
    if (error.status === 404) {
      closeDeleteModal();
      await loadVehicles();
    }
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  loadVehicles();
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
