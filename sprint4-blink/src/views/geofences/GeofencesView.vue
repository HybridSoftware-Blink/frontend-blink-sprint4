<template>
  <div class="min-h-screen bg-gray-50 flex">
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
      <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-semibold">Geofencing</h1>
            <button
              @click="createGeofence"
              class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Crear Geofence
            </button>
          </div>

          <div class="grid grid-cols-4 gap-6">
              <div class="col-span-1 bg-gray-50 rounded-md border border-gray-200 p-4 overflow-auto max-h-96">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-semibold">Geofences</h3>
                  <button
                    @click="showForm = !showForm"
                    class="text-sm text-white bg-green-600 px-2 py-1 rounded"
                  >
                    {{ showForm ? 'Cancelar' : 'Nuevo' }}
                  </button>
                </div>

                <div v-if="showForm" class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Nombre</label>
                  <input v-model="form.name" class="w-full mt-1 p-2 border rounded" />

                  <label class="block text-sm font-medium text-gray-700 mt-2">Tipo</label>
                  <input v-model="form.type" class="w-full mt-1 p-2 border rounded" />

                  <label class="block text-sm font-medium text-gray-700 mt-2">Radio (m)</label>
                  <input v-model.number="form.radius" type="number" class="w-full mt-1 p-2 border rounded" />

                  <div class="text-xs text-gray-500 mt-2">Selecciona la ubicación haciendo click en el mapa.</div>
                  <div class="mt-3 flex gap-2">
                    <button @click="submitForm" class="px-3 py-1 bg-blue-600 text-white rounded">Guardar</button>
                    <button @click="resetForm" class="px-3 py-1 bg-gray-200 rounded">Limpiar</button>
                  </div>
                </div>

                <ul class="space-y-2">
                  <li v-for="g in geofences" :key="g.geofence_id">
                    <button
                      @click="selectGeofence(g)"
                      class="w-full text-left p-2 rounded hover:bg-white/50"
                    >
                      <div class="font-medium">{{ g.name }}</div>
                      <div class="text-xs text-gray-500">ID: {{ g.geofence_id }}</div>
                    </button>
                  </li>
                </ul>
              </div>

            <div class="col-span-3">
              <div id="map" class="h-96 w-full rounded-md border border-gray-200 bg-gray-50"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../../components/layout/Sidebar.vue'
import { authService } from '../../services/auth.service'
import { useToast } from '../../composables/useToast'
import { geofenceService } from '../../services/geofence.service'
import type { Geofence } from '../../types/geofence.types'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const toast = useToast()
const user = ref(null)
const geofences = ref<Geofence[]>([])
const selected = ref<Geofence | null>(null)
const showForm = ref(false)
const form = ref<Partial<Geofence>>({ name: '', type: '', radius: 50, polygon_coordinates: null })
let map: L.Map | null = null
let markersLayer: L.LayerGroup | null = null
let selectedMarker: L.Marker | null = null

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
  }
    await loadGeofences()
    initMap()
})

const handleLogout = async () => {
  await authService.logout()
  router.push('/login')
}

function createGeofence() {
  alert('Crear Geofence - implementar formulario')
}

async function loadGeofences() {
  try {
    geofences.value = await geofenceService.list()
  } catch (err: any) {
    toast.error(err?.message || 'Error cargando geofences')
  }
}

function initMap() {
  // Initialize map
  map = L.map('map').setView([0, 0], 2)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
  renderGeofences()

  // click to choose coordinates when creating
  map.on('click', (e: L.LeafletMouseEvent) => {
    if (!showForm.value) return
    const { lat, lng } = e.latlng
    form.value.center_latitude = lat
    form.value.center_longitude = lng

    if (selectedMarker) {
      selectedMarker.setLatLng([lat, lng])
    } else {
      selectedMarker = L.marker([lat, lng]).addTo(map!)
    }
  })
}

function renderGeofences() {
  if (!map || !markersLayer) return
  markersLayer.clearLayers()

  if (geofences.value.length === 0) return

  const bounds: L.LatLngBoundsExpression[] = []

  geofences.value.forEach((g) => {
    if (g.center_latitude != null && g.center_longitude != null) {
      const lat = Number(g.center_latitude)
      const lng = Number(g.center_longitude)
      const marker = L.circle([lat, lng], {
        radius: g.radius ?? 50,
        color: '#3b82f6',
        fillOpacity: 0.2,
      }).bindPopup(`<strong>${g.name}</strong>`)
      marker.addTo(markersLayer!)
      bounds.push([lat, lng])
    }
    // If polygon_coordinates exist (assumed GeoJSON or array of coords), try to draw polygon
    if (g.polygon_coordinates) {
      try {
        const coords = typeof g.polygon_coordinates === 'string'
          ? JSON.parse(g.polygon_coordinates)
          : g.polygon_coordinates

        // Expect array of [lat, lng] pairs or GeoJSON-like structure
        if (Array.isArray(coords) && coords.length > 0) {
          const latlngs = coords.map((c: any) => [Number(c[0]), Number(c[1])])
          const poly = L.polygon(latlngs, { color: '#f97316', fillOpacity: 0.1 }).bindPopup(`<strong>${g.name}</strong>`)
          poly.addTo(markersLayer!)
          bounds.push(latlngs[0])
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  })

  if (bounds.length > 0 && map) {
    map.fitBounds(bounds as any)
  }
}

function selectGeofence(g: Geofence) {
  selected.value = g
  if (g.center_latitude != null && g.center_longitude != null && map) {
    map.setView([Number(g.center_latitude), Number(g.center_longitude)], 14)
  }
}

function resetForm() {
  form.value = { name: '', type: '', radius: 50, polygon_coordinates: null }
  showForm.value = false
  if (selectedMarker && map) {
    map.removeLayer(selectedMarker)
    selectedMarker = null
  }
}

async function submitForm() {
  try {
    // minimal validation
    if (!form.value.name) {
      toast.error('Nombre requerido')
      return
    }
    await geofenceService.create(form.value)
    await loadGeofences()
    renderGeofences()
    toast && toast.success && toast.success('Geofence creado')
    resetForm()
  } catch (err: any) {
    toast.error(err?.message || 'Error creando geofence')
  }
}
</script>
