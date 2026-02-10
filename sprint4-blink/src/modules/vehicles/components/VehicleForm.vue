<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Primera fila: License Plate i Brand -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput
        v-model="formData.license_plate"
        :label="t('vehicles.form.licensePlate')"
        :placeholder="t('vehicles.form.licensePlatePlaceholder')"
        :error="errors?.license_plate ? t(errors.license_plate) : undefined"
        required
      />

      <BaseInput
        v-model="formData.brand"
        :label="t('vehicles.form.brand')"
        :placeholder="t('vehicles.form.brandPlaceholder')"
        :error="errors?.brand ? t(errors.brand) : undefined"
        required
      />
    </div>

    <!-- Segona fila: Model i Year -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput
        v-model="formData.model"
        :label="t('vehicles.form.model')"
        :placeholder="t('vehicles.form.modelPlaceholder')"
        :error="errors?.model ? t(errors.model) : undefined"
        required
      />

      <BaseInput
        v-model.number="formData.year"
        type="number"
        :label="t('vehicles.form.year')"
        :placeholder="t('vehicles.form.yearPlaceholder')"
        :error="errors?.year ? t(errors.year) : undefined"
        required
        :min="2000"
        :max="new Date().getFullYear() + 1"
      />
    </div>

    <!-- Tercera fila: Color i Status -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Color Selector amb Popup -->
      <div class="relative" ref="colorPickerContainer">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t('vehicles.form.color') }}
          <span class="text-red-500">*</span>
        </label>
        
        <!-- Input que mostra el color seleccionat -->
        <button
          type="button"
          @click.stop="showColorPicker = !showColorPicker"
          class="w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent text-left flex items-center justify-between"
          :class="errors?.color ? 'border-red-500' : 'border-gray-300'"
        >
          <div class="flex items-center gap-3">
            <div
              v-if="formData.color"
              class="size-6 rounded-full border-2 border-gray-300"
              :style="{ backgroundColor: getColorHex(formData.color) }"
            />
            <span :class="formData.color ? 'text-gray-900' : 'text-gray-400'">
              {{ formData.color ? t(`vehicles.colors.${formData.color}`) : t('vehicles.form.colorPlaceholder') }}
            </span>
          </div>
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Popup amb els colors -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showColorPicker"
            @click.stop
            class="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-4"
          >
            <div class="grid grid-cols-6 gap-3">
              <button
                v-for="colorOption in colorOptions"
                :key="colorOption.value"
                type="button"
                @click.stop="selectColor(colorOption.value)"
                class="relative group"
                :title="colorOption.label"
              >
                <div
                  class="size-10 rounded-full border-2 transition-all hover:scale-110"
                  :style="{ backgroundColor: colorOption.hex }"
                  :class="formData.color === colorOption.value ? 'border-purple-600 ring-2 ring-purple-300' : 'border-gray-300'"
                >
                  <!-- Checkmark when selected -->
                  <svg
                    v-if="formData.color === colorOption.value"
                    class="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <!-- Tooltip with color name -->
                <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                  {{ t(`vehicles.colors.${colorOption.value}`) }}
                </span>
              </button>
            </div>
          </div>
        </Transition>

        <p v-if="errors?.color" class="text-red-500 text-xs mt-1">
          {{ t(errors.color) }}
        </p>
      </div>

      <!-- Status Selector amb Popup -->
      <div class="relative" ref="statusPickerContainer">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t('vehicles.form.status') }}
          <span class="text-red-500">*</span>
        </label>
        
        <!-- Botó que mostra l'estat seleccionat -->
        <button
          type="button"
          @click.stop="showStatusPicker = !showStatusPicker"
          class="w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent text-left flex items-center justify-between"
          :class="errors?.status ? 'border-red-500' : 'border-gray-300'"
        >
          <span class="text-gray-900">
            {{ t(`vehicles.status.${formData.status}`) }}
          </span>
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Popup amb els estats -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showStatusPicker"
            @click.stop
            class="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1"
          >
            <button
              v-for="statusOption in statusOptions"
              :key="statusOption.value"
              type="button"
              @click.stop="selectStatus(statusOption.value)"
              class="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center justify-between"
              :class="formData.status === statusOption.value ? 'bg-purple-50 text-purple-700' : 'text-gray-900'"
            >
              <span>{{ t(`vehicles.status.${statusOption.value}`) }}</span>
              <svg
                v-if="formData.status === statusOption.value"
                class="w-5 h-5 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </Transition>

        <p v-if="errors?.status" class="text-red-500 text-xs mt-1">
          {{ t(errors.status) }}
        </p>
      </div>
    </div>

    <!-- Quarta fila: Battery Level (ocupa tota l'amplada) -->
    <div>
      <BaseInput
        v-model="batteryLevelModel"
        type="number"
        :label="t('vehicles.form.batteryLevel')"
        :placeholder="t('vehicles.form.batteryLevelPlaceholder')"
        :error="errors?.battery_level ? t(errors.battery_level) : undefined"
        :min="0"
        :max="100"
      />
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-4 border-t">
      <BaseButton
        type="button"
        variant="secondary"
        @click="$emit('cancel')"
      >
        {{ t('common.cancel') }}
      </BaseButton>
      <BaseButton
        type="submit"
        variant="primary"
        :loading="loading"
      >
        {{ t('common.save') }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { BaseInput, BaseButton } from '@/components/base';
import type { CreateVehicleData, Vehicle } from '../types/vehicle.types';
import type { ValidationErrors } from '@/shared/utils/validators';

interface Props {
  vehicle?: Vehicle | null;
  errors?: ValidationErrors;
  loading?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [data: CreateVehicleData];
  cancel: [];
}>();

const { t } = useI18n();

// Control del popup de colors
const showColorPicker = ref(false);
const colorPickerContainer = ref<HTMLElement | null>(null);

// Control del popup d'estat
const showStatusPicker = ref(false);
const statusPickerContainer = ref<HTMLElement | null>(null);

// Color options amb codis hexadecimals - 3 línies ben ordenades
const colorOptions = [
  // Línia 1: Neutres i bàsics
  { value: 'White', label: 'White', hex: '#FFFFFF' },
  { value: 'Black', label: 'Black', hex: '#000000' },
  { value: 'Gray', label: 'Gray', hex: '#6B7280' },
  { value: 'Silver', label: 'Silver', hex: '#C0C0C0' },
  { value: 'Beige', label: 'Beige', hex: '#D4A574' },
  { value: 'Brown', label: 'Brown', hex: '#92400E' },
  // Línia 2: Colors càlids
  { value: 'Red', label: 'Red', hex: '#DC2626' },
  { value: 'Orange', label: 'Orange', hex: '#EA580C' },
  { value: 'Yellow', label: 'Yellow', hex: '#EAB308' },
  { value: 'Gold', label: 'Gold', hex: '#F59E0B' },
  { value: 'Pink', label: 'Pink', hex: '#EC4899' },
  { value: 'Burgundy', label: 'Burgundy', hex: '#881337' },
  // Línia 3: Colors freds
  { value: 'Green', label: 'Green', hex: '#16A34A' },
  { value: 'Teal', label: 'Teal', hex: '#14B8A6' },
  { value: 'Blue', label: 'Blue', hex: '#2563EB' },
  { value: 'Navy', label: 'Navy', hex: '#1E3A8A' },
  { value: 'Purple', label: 'Purple', hex: '#9333EA' },
  { value: 'Violet', label: 'Violet', hex: '#7C3AED' },
];

// Opcions d'estat
const statusOptions = [
  { value: 'available' },
  { value: 'in_use' },
  { value: 'maintenance' },
  { value: 'inactive' },
];

const formData = reactive<CreateVehicleData>({
  license_plate: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  status: 'available',
  battery_level: undefined,
});

// Computed property para manejar battery_level de forma segura
const batteryLevelModel = computed({
  get: () => formData.battery_level?.toString() ?? '',
  set: (value: string | number) => {
    if (value === '' || value === null || value === undefined) {
      formData.battery_level = undefined;
    } else {
      const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
      formData.battery_level = isNaN(numValue) ? undefined : numValue;
    }
  },
});

// Funció per obtenir el codi hexadecimal d'un color
const getColorHex = (colorName: string): string => {
  const color = colorOptions.find(c => c.value === colorName);
  return color?.hex || '#6B7280';
};

// Funció per seleccionar un color i tancar el popup
const selectColor = (colorValue: string) => {
  formData.color = colorValue;
  showColorPicker.value = false;
};

// Funció per seleccionar un estat i tancar el popup
const selectStatus = (statusValue: string) => {
  formData.status = statusValue as any;
  showStatusPicker.value = false;
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (colorPickerContainer.value && !colorPickerContainer.value.contains(event.target as Node)) {
    showColorPicker.value = false;
  }
  if (statusPickerContainer.value && !statusPickerContainer.value.contains(event.target as Node)) {
    showStatusPicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Watch para actualizar el formulario cuando cambia el vehículo
watch(
  () => props.vehicle,
  (newVehicle) => {
    if (newVehicle) {
      formData.license_plate = newVehicle.license_plate;
      formData.brand = newVehicle.brand;
      formData.model = newVehicle.model;
      formData.year = newVehicle.year;
      formData.color = newVehicle.color;
      formData.status = newVehicle.status;
      formData.battery_level = newVehicle.battery_level;
    } else {
      // Reset form
      formData.license_plate = '';
      formData.brand = '';
      formData.model = '';
      formData.year = new Date().getFullYear();
      formData.color = '';
      formData.status = 'available';
      formData.battery_level = undefined;
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', { ...formData });
};
</script>
