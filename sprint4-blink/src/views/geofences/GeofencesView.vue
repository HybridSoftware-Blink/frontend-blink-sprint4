<template>
  <div class="h-screen bg-gray-50 flex overflow-hidden">
      <aside class="w-72 shrink-0 h-screen">
      <Sidebar class="h-full" />
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Navbar -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-primary-600">Blink</h1>
            </div>

            <div class="flex items-center space-x-4">
              <span class="text-gray-700">{{ user?.name }}</span>
              <button
                @click="handleLogout"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Contenido principal -->
      <main class="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-hidden">
        <BaseCard padding="md" class="h-full flex flex-col min-h-0 p-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-semibold">Geofencing</h1>
          </div>

          <div class="flex flex-1 gap-6 min-h-0">
              <CrudList
                :items="geofences"
                :pageSize="pageSize"
                :showForm="showForm"
                item-key="geofence_id"
                title="Geofences"
                @toggle-create="showForm = !showForm"
                @select="selectGeofence"
                @delete="deleteGeofence"
                @page-changed="(p) => currentPage = p"
              >
                <template #form>
                  <BaseInput v-model="form.name" label="Nombre" placeholder="Nombre del geofence" />

                  <label class="block text-sm font-medium text-gray-700 mt-2">Tipo</label>
                  <select v-model="form.type" class="w-full mt-1 p-2 border rounded">
                    <option value="">Selecciona un tipo</option>
                    <option value="allowed">allowed</option>
                    <option value="restricted">restricted</option>
                    <option value="parking">parking</option>
                    <option value="service_area">service_area</option>
                  </select>

                  <BaseInput v-model.number="form.radius" label="Radio (m)" type="number" />

                  <div class="text-xs text-gray-500 mt-2">Selecciona la ubicación haciendo click en el mapa.</div>
                  <div class="mt-3 flex gap-2">
                    <BaseButton size="sm" variant="primary" @click="submitForm">Guardar</BaseButton>
                    <BaseButton size="sm" variant="tertiary" @click="resetForm">Limpiar</BaseButton>
                  </div>
                </template>
              </CrudList>

            <div class="flex-1 min-h-0">
              <MapLibreMap ref="mapRef" :geofences="geofences" @map-click="onMapClick" />
            </div>
          </div>
        </BaseCard>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../../components/layout/Sidebar.vue'
import { BaseButton, BaseInput, BaseCard, BaseAlert } from '../../components/base'
import { authService } from '../../services/auth.service'
import { useToast } from '../../composables/useToast'
import { geofenceService } from '../../services/geofence.service'
import type { Geofence } from '../../types/geofence.types'
import MapLibreMap from '../../components/layout/MapLibreMap.vue'
import CrudList from '../../components/layout/CrudList.vue'
import { TrashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const toast = useToast()
const user = ref(null)
const geofences = ref<Geofence[]>([])
const selected = ref<Geofence | null>(null)
const showForm = ref(false)
const form = ref<Partial<Geofence>>({ name: '', type: '', radius: 50, polygon_coordinates: null })
const mapRef = ref<any>(null)
// Pagination
const pageSize = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(geofences.value.length / pageSize)))
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const paginatedGeofences = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return geofences.value.slice(start, start + pageSize)
})

const startItem = computed(() => (geofences.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1))
const endItem = computed(() => Math.min(geofences.value.length, currentPage.value * pageSize))

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

watch(geofences, () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
})

async function loadGeofences() {
  try {
    geofences.value = await geofenceService.list()
  } catch (err: any) {
    toast.error(err?.message || 'Error cargando geofences')
  }
}
onMounted(async () => {
  user.value = authService.getUser()
  try {
    const me = await authService.getCurrentUser()
    user.value = me
    authService.setUser(me)
  } catch (_err) {
    toast.error('Tu sesión ha caducado. Vuelve a iniciar sesión.')
    await authService.logout()
    router.push('/login')
    return
  }

  await loadGeofences()
})

// map rendering is handled by `MapLibreMap` component

function selectGeofence(g: Geofence) {
  selected.value = g
  form.value = {
    geofence_id: g.geofence_id,
    name: g.name,
    type: g.type,
    radius: g.radius ?? 50,
    center_latitude: g.center_latitude,
    center_longitude: g.center_longitude,
    polygon_coordinates: g.polygon_coordinates,
  }
  showForm.value = true

  if (g.center_latitude != null && g.center_longitude != null) {
    const lat = Number(g.center_latitude)
    const lng = Number(g.center_longitude)
    try { mapRef.value?.setSelectedMarker(lng, lat) } catch (e) {}
    try { mapRef.value?.flyTo(lng, lat, 14) } catch (e) {}
  }
}

function resetForm() {
  form.value = { name: '', type: '', radius: 50, polygon_coordinates: null }
  showForm.value = false
  selected.value = null
  try { mapRef.value?.removeSelectedMarker() } catch (e) {}
}

function onMapClick(p: { lng: number; lat: number }) {
  form.value.center_latitude = p.lat
  form.value.center_longitude = p.lng
}

async function submitForm() {
  try {
    // minimal validation
    if (!form.value.name) {
      toast.error('Nombre requerido')
      return
    }
    // If editing (has geofence_id) call update, otherwise create
    if (form.value.geofence_id) {
      await geofenceService.update(form.value.geofence_id as number, form.value)
      toast && toast.success && toast.success('Geofence actualizado')
    } else {
      await geofenceService.create(form.value)
      toast && toast.success && toast.success('Geofence creado')
    }
    await loadGeofences()
    resetForm()
  } catch (err: any) {
    toast.error(err?.message || 'Error creando geofence')
  }
}

async function deleteGeofence(g: Geofence) {
  if (!confirm(`Eliminar geofence "${g.name}"?`)) return
  try {
    await geofenceService.delete(g.geofence_id)
    await loadGeofences()
    toast && (toast as any).success && (toast as any).success('Geofence eliminado')
  } catch (err: any) {
    toast.error(err?.message || 'Error al eliminar')
  }
}
</script>
