<template>
  <AppLayout :title="$t('bookings.browseVehicles.title')">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filtres de cerca -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">{{ $t('bookings.browseVehicles.filters') }}</h3>
        
        <!-- Buscador de text -->
        <div class="mb-4">
          <input 
            type="text" 
            v-model="searchQuery"
            :placeholder="$t('vehicles.searchPlaceholder')"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('bookings.browseVehicles.startDate') }}
            </label>
            <input 
              type="date" 
              v-model="filters.startDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('bookings.browseVehicles.endDate') }}
            </label>
            <input 
              type="date" 
              v-model="filters.endDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('vehicles.type') }}
            </label>
            <select 
              v-model="filters.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{{ $t('reservations.filters.all') }}</option>
              <option v-for="type in vehicleTypes" :key="type" :value="type">
                {{ $t(`vehicles.types.${type}`) }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('bookings.browseVehicles.priceRange') }}
            </label>
            <select 
              v-model="filters.priceRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{{ $t('reservations.filters.all') }}</option>
              <option value="0-50">0€ - 50€</option>
              <option value="50-100">50€ - 100€</option>
              <option value="100-200">100€ - 200€</option>
              <option value="200+">200€+</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <BaseButton @click="clearFilters" variant="secondary" class="mr-2">
            {{ $t('reservations.actions.clearFilters') }}
          </BaseButton>
          <BaseButton @click="searchVehicles" variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {{ $t('bookings.browseVehicles.search') }}
          </BaseButton>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Galeria de vehicles -->
      <div v-else-if="filteredVehicles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="vehicle in filteredVehicles" 
          :key="vehicle.vehicle_id"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Imatge del vehicle -->
          <div class="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700">
            <svg class="absolute inset-0 w-full h-full p-12 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
            <div class="absolute top-2 right-2">
              <span 
                class="px-3 py-1 rounded-full text-xs font-semibold text-white"
                :class="vehicle.status === 'available' ? 'bg-green-500' : 'bg-red-500'"
              >
                {{ $t(`vehicles.status.${vehicle.status}`) }}
              </span>
            </div>
          </div>

          <!-- Informació del vehicle -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ vehicle.brand }} {{ vehicle.model }}</h3>
                <p class="text-sm text-gray-500">{{ vehicle.license_plate }}</p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-blue-600">{{ vehicle.price_per_day || 50 }}€</div>
                <div class="text-xs text-gray-500">{{ $t('bookings.browseVehicles.perDay') }}</div>
              </div>
            </div>

            <!-- Característiques -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {{ $t(`vehicles.types.${vehicle.type}`) }}
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ vehicle.capacity }} {{ $t('vehicles.seats') }}
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ vehicle.year }}
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ vehicle.location || 'Barcelona' }}
              </div>
            </div>

            <!-- Botó de reserva -->
            <BaseButton 
              @click="openBookingModal(vehicle)" 
              variant="primary" 
              class="w-full"
              :disabled="vehicle.status !== 'available'"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ $t('bookings.browseVehicles.bookNow') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('bookings.browseVehicles.noVehicles') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ $t('bookings.browseVehicles.noVehiclesDescription') }}</p>
      </div>

      <!-- Modal de reserva -->
      <BaseModalSlots :show="showBookingModal" @close="closeBookingModal">
        <template #title>{{ $t('bookings.browseVehicles.bookingModal.title') }}</template>
        <template #content>
          <div v-if="selectedVehicle" class="space-y-4">
            <!-- Info del vehicle -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-lg">{{ selectedVehicle.brand }} {{ selectedVehicle.model }}</h4>
              <p class="text-sm text-gray-600">{{ selectedVehicle.license_plate }}</p>
              <p class="text-xl font-bold text-blue-600 mt-2">{{ selectedVehicle.price_per_day || 50 }}€ / {{ $t('bookings.browseVehicles.perDay') }}</p>
            </div>

            <!-- Formulari de reserva -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('bookings.browseVehicles.startDate') }}
                </label>
                <input 
                  type="date" 
                  v-model="bookingForm.start_date"
                  :min="minDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('bookings.browseVehicles.startTime') }}
                </label>
                <input 
                  type="time" 
                  v-model="bookingForm.start_time"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('bookings.browseVehicles.endDate') }}
                </label>
                <input 
                  type="date" 
                  v-model="bookingForm.end_date"
                  :min="bookingForm.start_date || minDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('bookings.browseVehicles.endTime') }}
                </label>
                <input 
                  type="time" 
                  v-model="bookingForm.end_time"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <!-- Missatge d'error de validació -->
            <div v-if="dateValidationError" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                {{ dateValidationError }}
              </p>
            </div>

            <!-- Ubicacions -->
            <div class="grid grid-cols-2 gap-4">
              <BaseInput
                v-model="bookingForm.pickup_location"
                :label="$t('bookings.browseVehicles.pickupLocation')"
                :placeholder="$t('bookings.browseVehicles.pickupLocationPlaceholder')"
              />
              <BaseInput
                v-model="bookingForm.dropoff_location"
                :label="$t('bookings.browseVehicles.dropoffLocation')"
                :placeholder="$t('bookings.browseVehicles.dropoffLocationPlaceholder')"
              />
            </div>

            <!-- Resum del preu -->
            <div v-if="totalCost > 0" class="bg-green-50 p-4 rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm text-gray-600">{{ $t('bookings.browseVehicles.totalHours') }}: {{ totalHours }}h</p>
                  <p class="text-sm text-gray-600">{{ $t('bookings.browseVehicles.pricePerHour') }}: 5€</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">{{ $t('bookings.browseVehicles.totalCost') }}</p>
                  <p class="text-2xl font-bold text-green-600">{{ totalCost.toFixed(2) }}€</p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #actions>
          <BaseButton @click="closeBookingModal" variant="secondary">
            {{ $t('reservations.actions.cancel') }}
          </BaseButton>
          <BaseButton 
            @click="confirmBooking" 
            variant="primary"
            :disabled="!isBookingFormValid"
          >
            {{ $t('bookings.browseVehicles.confirmBooking') }}
          </BaseButton>
        </template>
      </BaseModalSlots>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import BaseModalSlots from '@/components/base/BaseModalSlots.vue'
import { BaseButton, BaseInput } from '@/components/base'
import { vehicleService } from '@/modules/vehicles/services/vehicle.service'
import { reservationService } from '@/modules/reservations/services/reservation.service'
import type { Vehicle } from '@/modules/vehicles/types/vehicle.types'
import { useToast } from '@/shared/composables/useToast'

const { t } = useI18n()
const router = useRouter()
const { success, error } = useToast()

const loading = ref(false)
const availableVehicles = ref<Vehicle[]>([])
const searchQuery = ref('')
const vehicleTypes = ['sedan', 'suv', 'truck', 'van', 'coupe', 'convertible', 'hatchback']

const filters = ref({
  startDate: '',
  endDate: '',
  type: '',
  priceRange: ''
})

const showBookingModal = ref(false)
const selectedVehicle = ref<Vehicle | null>(null)
const minDate = computed(() => new Date().toISOString().split('T')[0])

const bookingForm = ref({
  start_date: '',
  start_time: '09:00',
  end_date: '',
  end_time: '18:00',
  pickup_location: '',
  dropoff_location: ''
})

const totalCost = computed(() => {
  if (!totalHours.value || totalHours.value === 0) return 0
  const pricePerHour = 5 // 5€ per hora
  const cost = pricePerHour * totalHours.value
  return Math.round(cost * 100) / 100 // Arrodonir a 2 decimals
})

const totalHours = computed(() => {
  if (!bookingForm.value.start_date || !bookingForm.value.end_date) return 0
  
  const startDate = `${bookingForm.value.start_date}T${bookingForm.value.start_time || '00:00'}`
  const endDate = `${bookingForm.value.end_date}T${bookingForm.value.end_time || '23:59'}`
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const hours = Math.round(diffTime / (1000 * 60 * 60))
  
  return hours
})

const filteredVehicles = computed(() => {
  if (!searchQuery.value) {
    return availableVehicles.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return availableVehicles.value.filter(vehicle => {
    const brand = vehicle.brand?.toLowerCase() || ''
    const model = vehicle.model?.toLowerCase() || ''
    const licensePlate = vehicle.license_plate?.toLowerCase() || ''
    const color = vehicle.color?.toLowerCase() || ''
    
    return brand.includes(query) || 
           model.includes(query) || 
           licensePlate.includes(query) ||
           color.includes(query)
  })
})

const isBookingFormValid = computed(() => {
  // Validar que tots els camps estiguin omplerts
  if (!bookingForm.value.start_date || 
      !bookingForm.value.end_date || 
      !bookingForm.value.pickup_location ||
      !bookingForm.value.dropoff_location) {
    return false
  }
  
  // Validar que la data de finalització no sigui anterior a la d'inici
  if (bookingForm.value.end_date < bookingForm.value.start_date) {
    return false
  }
  
  // Si és el mateix dia, validar que l'hora de fi sigui posterior a la d'inici
  if (bookingForm.value.start_date === bookingForm.value.end_date) {
    if (bookingForm.value.end_time <= bookingForm.value.start_time) {
      return false
    }
  }
  
  // Validar que les hores totals siguin > 0
  return totalHours.value > 0
})

const dateValidationError = computed(() => {
  if (!bookingForm.value.start_date || !bookingForm.value.end_date) {
    return ''
  }
  
  if (bookingForm.value.end_date < bookingForm.value.start_date) {
    return t('bookings.browseVehicles.errors.endDateBeforeStart')
  }
  
  if (bookingForm.value.start_date === bookingForm.value.end_date) {
    if (bookingForm.value.end_time && bookingForm.value.start_time && 
        bookingForm.value.end_time <= bookingForm.value.start_time) {
      return t('bookings.browseVehicles.errors.endTimeBeforeStart')
    }
  }
  
  return ''
})

const loadVehicles = async () => {
  loading.value = true
  try {
    const response = await vehicleService.getVehicles()
    // Filtrar només vehicles disponibles
    availableVehicles.value = response.data.filter((v: Vehicle) => v.status === 'available')
  } catch (err) {
    error(t('vehicles.errors.load'))
  } finally {
    loading.value = false
  }
}

const searchVehicles = async () => {
  loading.value = true
  try {
    const response = await vehicleService.getVehicles()
    let filtered = response.data.filter((v: Vehicle) => v.status === 'available')

    // Filtrar per tipus
    if (filters.value.type) {
      filtered = filtered.filter((v: Vehicle) => v.type === filters.value.type)
    }

    // Filtrar per preu
    if (filters.value.priceRange) {
      const [minStr, maxStr] = filters.value.priceRange.split('-')
      const min = minStr ? (minStr === '+' ? 0 : parseInt(minStr)) : 0
      const max = maxStr ? (maxStr === '+' ? Infinity : parseInt(maxStr)) : Infinity
      
      filtered = filtered.filter((v: Vehicle) => {
        const price = v.price_per_day
        return price >= min && price <= max
      })
    }

    availableVehicles.value = filtered
  } catch (err) {
    error(t('vehicles.errors.load'))
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = {
    startDate: '',
    endDate: '',
    type: '',
    priceRange: ''
  }
  loadVehicles()
}

const openBookingModal = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle
  bookingForm.value = {
    start_date: filters.value.startDate || '',
    start_time: '09:00',
    end_date: filters.value.endDate || '',
    end_time: '18:00',
    pickup_location: vehicle.location || '',
    dropoff_location: vehicle.location || ''
  }
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
  selectedVehicle.value = null
}

const confirmBooking = async () => {
  if (!selectedVehicle.value || !isBookingFormValid.value) return

  try {
    const bookingData = {
      vehicle_id: selectedVehicle.value.vehicle_id,
      start_date: `${bookingForm.value.start_date}T${bookingForm.value.start_time}`,
      end_date: `${bookingForm.value.end_date}T${bookingForm.value.end_time}`,
      pickup_location: bookingForm.value.pickup_location,
      dropoff_location: bookingForm.value.dropoff_location,
      total_cost: totalCost.value.toString(),
      status: 'pending' as const
    }

    await reservationService.createReservation(bookingData)
    success(t('bookings.browseVehicles.bookingSuccess'))
    closeBookingModal()
    router.push('/my-calendar')
  } catch (err) {
    error(t('bookings.browseVehicles.bookingError'))
  }
}

onMounted(() => {
  loadVehicles()
})
</script>
