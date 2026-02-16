<template>
  <AppLayout :title="$t('bookings.myCalendar.title')">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header amb navegació del mes -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center">
          <button 
            @click="previousMonth"
            :disabled="!canGoPrevious"
            class="p-2 rounded-lg transition-colors"
            :class="canGoPrevious ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ currentMonthName }} {{ currentYear }}
          </h2>
          <button 
            @click="nextMonth"
            :disabled="!canGoNext"
            class="p-2 rounded-lg transition-colors"
            :class="canGoNext ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Llegenda -->
      <div class="mb-6 flex flex-wrap gap-4 justify-center">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
          <span class="text-sm text-gray-600">{{ $t('bookings.myCalendar.pending') }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-green-400 rounded mr-2"></div>
          <span class="text-sm text-gray-600">{{ $t('bookings.myCalendar.active') }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-blue-400 rounded mr-2"></div>
          <span class="text-sm text-gray-600">{{ $t('bookings.myCalendar.completed') }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-red-400 rounded mr-2"></div>
          <span class="text-sm text-gray-600">{{ $t('bookings.myCalendar.cancelled') }}</span>
        </div>
      </div>

      <!-- Calendari -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Dies de la setmana -->
        <div class="grid grid-cols-7 bg-gray-50 border-b">
          <div 
            v-for="day in weekDays" 
            :key="day"
            class="p-4 text-center text-sm font-semibold text-gray-700"
          >
            {{ day }}
          </div>
        </div>

        <!-- Dies del mes -->
        <div class="grid grid-cols-7 auto-rows-fr">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="border-r border-b min-h-[120px] p-2 hover:bg-gray-50 transition-colors cursor-pointer"
            :class="{
              'bg-gray-50': !day.isCurrentMonth,
              'bg-blue-50': day.isToday
            }"
            @click="selectDay(day)"
          >
            <div class="flex justify-between items-start mb-1">
              <span 
                class="text-sm font-medium"
                :class="{
                  'text-gray-400': !day.isCurrentMonth,
                  'text-blue-600 font-bold': day.isToday,
                  'text-gray-900': day.isCurrentMonth && !day.isToday
                }"
              >
                {{ day.date }}
              </span>
            </div>

            <!-- Reserves del dia -->
            <div class="space-y-1">
              <div
                v-for="booking in day.bookings"
                :key="booking.reservation_id"
                @click.stop="openBookingDetails(booking)"
                class="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                :class="getBookingColor(booking.status)"
              >
                <div class="font-medium">{{ booking.vehicle.brand }} {{ booking.vehicle.model }}</div>
                <div class="text-[10px] opacity-90">
                  {{ formatTime(booking.start_date) }} - {{ formatTime(booking.end_date) }}
                </div>
              </div>
            </div>

            <!-- Indicador si hi ha més reserves -->
            <div v-if="day.bookings.length > 2" class="text-[10px] text-gray-500 mt-1">
              +{{ day.bookings.length - 2 }} {{ $t('bookings.myCalendar.more') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Llista de reserves del mes -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">{{ $t('bookings.myCalendar.monthBookings') }}</h3>
        
        <div v-if="monthBookings.length === 0" class="text-center py-8 text-gray-500">
          {{ $t('bookings.myCalendar.noBookingsThisMonth') }}
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="booking in monthBookings"
            :key="booking.reservation_id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="openBookingDetails(booking)"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold text-lg">{{ booking.vehicle.brand }} {{ booking.vehicle.model }}</h4>
                <p class="text-sm text-gray-600">{{ booking.vehicle.license_plate }}</p>
                <div class="mt-2 flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(booking.start_date) }} - {{ formatDate(booking.end_date) }}
                </div>
              </div>
              <div class="text-right">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="getStatusBadgeColor(booking.status)"
                >
                  {{ $t(`reservations.status.${booking.status}`) }}
                </span>
                <p class="text-xl font-bold text-gray-900 mt-2">{{ booking.total_cost }}€</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de detalls de la reserva -->
      <BaseModalSlots :show="showDetailsModal" @close="closeDetailsModal">
        <template #title>{{ $t('bookings.myCalendar.bookingDetails') }}</template>
        <template #content>
          <div v-if="selectedBooking" class="space-y-4">
            <!-- Vehicle -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-lg">{{ selectedBooking.vehicle.brand }} {{ selectedBooking.vehicle.model }}</h4>
              <p class="text-sm text-gray-600">{{ selectedBooking.vehicle.license_plate }}</p>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('bookings.browseVehicles.startDate') }}
                </label>
                <p class="text-gray-900">{{ formatDate(selectedBooking.start_date) }}</p>
                <p class="text-sm text-gray-600">{{ formatTime(selectedBooking.start_date) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('bookings.browseVehicles.endDate') }}
                </label>
                <p class="text-gray-900">{{ formatDate(selectedBooking.end_date) }}</p>
                <p class="text-sm text-gray-600">{{ formatTime(selectedBooking.end_date) }}</p>
              </div>
            </div>

            <!-- Ubicacions -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('bookings.browseVehicles.pickupLocation') }}
                </label>
                <p class="text-gray-900">{{ selectedBooking.pickup_location }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('bookings.browseVehicles.dropoffLocation') }}
                </label>
                <p class="text-gray-900">{{ selectedBooking.dropoff_location }}</p>
              </div>
            </div>

            <!-- Estat i preu -->
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('reservations.status.label') }}
                </label>
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="getStatusBadgeColor(selectedBooking.status)"
                >
                  {{ $t(`reservations.status.${selectedBooking.status}`) }}
                </span>
              </div>
              <div class="text-right">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('bookings.browseVehicles.totalCost') }}
                </label>
                <p class="text-2xl font-bold text-gray-900">{{ selectedBooking.total_cost }}€</p>
              </div>
            </div>
          </div>
        </template>
        <template #actions>
          <BaseButton @click="closeDetailsModal" variant="secondary">
            {{ $t('reservations.actions.close') }}
          </BaseButton>
          <BaseButton 
            v-if="selectedBooking && selectedBooking.status === 'pending'"
            @click="cancelBooking(selectedBooking.reservation_id)" 
            variant="secondary"
            class="!bg-red-600 !text-white hover:!bg-red-700"
          >
            {{ $t('bookings.actions.cancel') }}
          </BaseButton>
        </template>
      </BaseModalSlots>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/layouts/AppLayout.vue'
import BaseModalSlots from '@/components/base/BaseModalSlots.vue'
import { BaseButton } from '@/components/base'
import { reservationService } from '@/modules/reservations/services/reservation.service'
import type { Reservation } from '@/modules/reservations/types/reservation.types'
import { useToast } from '@/shared/composables/useToast'

const { t } = useI18n()
const { success, error } = useToast()

const today = new Date()
const currentDate = ref(new Date())
const minDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0)
const myBookings = ref<Reservation[]>([])
const selectedBooking = ref<Reservation | null>(null)
const showDetailsModal = ref(false)

const weekDays = computed(() => {
  return [
    t('bookings.myCalendar.days.monday'),
    t('bookings.myCalendar.days.tuesday'),
    t('bookings.myCalendar.days.wednesday'),
    t('bookings.myCalendar.days.thursday'),
    t('bookings.myCalendar.days.friday'),
    t('bookings.myCalendar.days.saturday'),
    t('bookings.myCalendar.days.sunday')
  ]
})

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString('ca-ES', { month: 'long' })
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

interface CalendarDay {
  date: number
  fullDate: Date
  isCurrentMonth: boolean
  isToday: boolean
  bookings: Reservation[]
}

const calendarDays = computed((): CalendarDay[] => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Ajustar per començar el dilluns (1 = Monday)
  let startDay = firstDay.getDay() - 1
  if (startDay === -1) startDay = 6
  
  const days: CalendarDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Dies del mes anterior
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i
    const fullDate = new Date(year, month - 1, date)
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      isToday: false,
      bookings: getBookingsForDay(fullDate)
    })
  }
  
  // Dies del mes actual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const fullDate = new Date(year, month, i)
    fullDate.setHours(0, 0, 0, 0)
    days.push({
      date: i,
      fullDate,
      isCurrentMonth: true,
      isToday: fullDate.getTime() === today.getTime(),
      bookings: getBookingsForDay(fullDate)
    })
  }
  
  // Dies del mes següent per completar la graella
  const remainingDays = 42 - days.length // 6 setmanes * 7 dies
  for (let i = 1; i <= remainingDays; i++) {
    const fullDate = new Date(year, month + 1, i)
    days.push({
      date: i,
      fullDate,
      isCurrentMonth: false,
      isToday: false,
      bookings: getBookingsForDay(fullDate)
    })
  }
  
  return days
})

const monthBookings = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  return myBookings.value.filter(booking => {
    const startDate = new Date(booking.start_date)
    const endDate = new Date(booking.end_date)
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    
    // Reserva que comença o acaba dins del mes
    return (startDate >= monthStart && startDate <= monthEnd) ||
           (endDate >= monthStart && endDate <= monthEnd) ||
           (startDate <= monthStart && endDate >= monthEnd)
  }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
})

const getBookingsForDay = (date: Date): Reservation[] => {
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)
  
  return myBookings.value.filter(booking => {
    const startDate = new Date(booking.start_date)
    const endDate = new Date(booking.end_date)
    
    // Reserva que està activa durant aquest dia
    return startDate <= dayEnd && endDate >= dayStart
  })
}

const getBookingColor = (status: string): string => {
  const colors = {
    pending: 'bg-yellow-400 text-yellow-900',
    active: 'bg-green-400 text-green-900',
    completed: 'bg-blue-400 text-blue-900',
    cancelled: 'bg-red-400 text-red-900'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400 text-gray-900'
}

const getStatusBadgeColor = (status: string): string => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ca-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('ca-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const canGoPrevious = computed(() => {
  const prevMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  return prevMonth >= minDate
})

const canGoNext = computed(() => {
  const nextMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  return nextMonth <= maxDate
})

const previousMonth = () => {
  if (canGoPrevious.value) {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
  }
}

const nextMonth = () => {
  if (canGoNext.value) {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
  }
}

const selectDay = (day: CalendarDay) => {
  if (day.bookings.length === 1 && day.bookings[0]) {
    openBookingDetails(day.bookings[0])
  } else if (day.bookings.length > 1) {
    // TODO: Mostrar llista de reserves del dia
    console.log('Multiple bookings on this day:', day.bookings)
  }
}

const openBookingDetails = (booking: Reservation) => {
  selectedBooking.value = booking
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedBooking.value = null
}

const cancelBooking = async (reservationId: number) => {
  try {
    await reservationService.updateReservationStatus(reservationId, 'cancelled')
    success(t('bookings.toast.cancelled'))
    closeDetailsModal()
    await loadBookings()
  } catch (err) {
    error(t('bookings.errors.cancel'))
  }
}

const loadBookings = async () => {
  try {
    const response = await reservationService.getReservations()
    // TODO: Filtrar només les reserves de l'usuari actual
    myBookings.value = response
  } catch (err) {
    error(t('reservations.errors.load'))
  }
}

onMounted(() => {
  loadBookings()
})
</script>
