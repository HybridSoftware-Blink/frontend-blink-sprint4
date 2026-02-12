<template>
  <div ref="container" class="h-full w-full rounded-md"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const props = defineProps({
  geofences: { type: Array, default: () => [] },
  vehicles: { type: Array, default: () => [] },
  showGeofences: { type: Boolean, default: true },
  styleUrl: { type: String, default: () => import.meta.env.VITE_MAPTILER_STYLE_URL || '' },
  apiKey: { type: String, default: () => import.meta.env.VITE_MAPTILER_KEY || '' },
})
const emit = defineEmits(['map-click', 'loaded'])

const container = ref<HTMLDivElement | null>(null)
let map: any = null
let markers: any[] = [] // geofence markers
let vehicleMarkers: any[] = []
let selectedMarker: any = null
const internalVehicles = ref<any[]>(props.vehicles || [])

function buildStyleWithKey() {
  const s = (props.styleUrl || '').replace(/\?key=.*$/, '')
  if (!s) return ''
  return s + (props.apiKey ? `?key=${props.apiKey}` : '')
}

function generateCircleCoordinates(lat: number, lng: number, radiusMeters: number, points = 64) {
  const coords: Array<[number, number]> = []
  const R = 6371000
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180
  const dDivR = radiusMeters / R

  for (let i = 0; i < points; i++) {
    const bearing = (i * 2 * Math.PI) / points
    const lat2 = Math.asin(Math.sin(latRad) * Math.cos(dDivR) + Math.cos(latRad) * Math.sin(dDivR) * Math.cos(bearing))
    const lng2 = lngRad + Math.atan2(Math.sin(bearing) * Math.sin(dDivR) * Math.cos(latRad), Math.cos(dDivR) - Math.sin(latRad) * Math.sin(lat2))
    coords.push([ (lng2 * 180) / Math.PI, (lat2 * 180) / Math.PI ])
  }
  if (coords.length > 0 && coords[0]) coords.push(coords[0])
  return coords
}

function clearFeatures() {
  markers.forEach((m) => { try { m.remove() } catch (e) {} })
  markers = []
  try {
    if (map.getLayer && map.getLayer('geofences-fill')) map.removeLayer('geofences-fill')
    if (map.getLayer && map.getLayer('geofences-line')) map.removeLayer('geofences-line')
    if (map.getSource && map.getSource('geofences')) map.removeSource('geofences')
  } catch (e) {}
}

function clearVehicleMarkers() {
  vehicleMarkers.forEach((m) => { try { m.remove() } catch (e) {} })
  vehicleMarkers = []
}

function render() {
  if (!map) return
  clearFeatures()
  if (!props.showGeofences) return
  if (!props.geofences || props.geofences.length === 0) return

  const bounds = new maplibregl.LngLatBounds()
  const polygonFeatures: any[] = []

  props.geofences.forEach((g: any) => {
    if (g.center_latitude != null && g.center_longitude != null) {
      const lat = Number(g.center_latitude)
      const lng = Number(g.center_longitude)
      const m = new maplibregl.Marker({ color: '#3b82f6' })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup().setHTML(`<strong>${g.name}</strong>`))
        .addTo(map)
      markers.push(m)
      bounds.extend([lng, lat])
    }

    if (g.polygon_coordinates) {
      try {
        const coords = typeof g.polygon_coordinates === 'string' ? JSON.parse(g.polygon_coordinates) : g.polygon_coordinates
        if (Array.isArray(coords) && coords.length > 0) {
          const polyCoords = coords.map((c: any) => [Number(c[1]), Number(c[0])])
          polygonFeatures.push({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [polyCoords] }, properties: { name: g.name } })
          polyCoords.forEach((p: any) => bounds.extend(p))
        }
      } catch (e) {}
    }

    if (g.radius != null && g.center_latitude != null && g.center_longitude != null) {
      try {
        const lat = Number(g.center_latitude)
        const lng = Number(g.center_longitude)
        const circleCoords = generateCircleCoordinates(lat, lng, Number(g.radius), 64)
        if (circleCoords.length > 0) {
          polygonFeatures.push({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [circleCoords] }, properties: { name: g.name } })
          circleCoords.forEach((p: any) => bounds.extend(p))
        }
      } catch (e) {}
    }
  })

  if (polygonFeatures.length > 0) {
    try {
      map.addSource('geofences', { type: 'geojson', data: { type: 'FeatureCollection', features: polygonFeatures } })
      map.addLayer({ id: 'geofences-fill', type: 'fill', source: 'geofences', paint: { 'fill-color': '#f97316', 'fill-opacity': 0.1 } })
      map.addLayer({ id: 'geofences-line', type: 'line', source: 'geofences', paint: { 'line-color': '#f97316', 'line-width': 2 } })
    } catch (e) {}
  }

  try {
    if (bounds && typeof bounds.isEmpty === 'function' && !bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 15 })
    }
  } catch (e) {
    console.warn('Error fitBounds:', e)
  }
}

function renderVehicles() {
  if (!map) return
  clearVehicleMarkers()
  if (!internalVehicles.value || internalVehicles.value.length === 0) return

  internalVehicles.value.forEach((v: any) => {
    if (v.latitude == null || v.longitude == null) return
    try {
      const lat = Number(v.latitude)
      const lng = Number(v.longitude)
      
      // Obtenir el color del vehicle (hex) o usar verd per defecte
      const vehicleColor = v.colorHex || v.color_hex || '#10b981'
      
      // Crear element HTML amb imatge del cotxe
      const el = document.createElement('div')
      el.style.cursor = 'pointer'
      el.style.width = '48px'
      el.style.height = '48px'
      el.style.position = 'relative'
      
      // Cercle de fons amb el color del vehicle
      const circle = document.createElement('div')
      circle.style.width = '48px'
      circle.style.height = '48px'
      circle.style.borderRadius = '50%'
      circle.style.backgroundColor = vehicleColor
      circle.style.border = `2px solid #000`
      circle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
      circle.style.display = 'flex'
      circle.style.alignItems = 'center'
      circle.style.justifyContent = 'center'
      circle.style.position = 'relative'
      
      // Imatge del cotxe amb filtre per fer-la blanca
      const img = document.createElement('img')
      img.src = '/car.png'
      img.alt = 'car'
      img.style.width = '28px'
      img.style.height = '28px'
      img.style.objectFit = 'contain'
      img.style.filter = 'brightness(0) invert(1)'
      
      circle.appendChild(img)
      el.appendChild(circle)
      
      const m = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup({ offset: 30 }).setHTML(`
          <div style="padding: 4px 8px;">
            <strong style="font-size: 14px;">${v.brand || ''} ${v.model || ''}</strong><br/>
            <span style="font-size: 12px; color: #666;">${v.license_plate || ''}</span>
          </div>
        `))
        .addTo(map)
      vehicleMarkers.push(m)
    } catch (e) {}
  })
}

onMounted(() => {
  const containerEl = container.value
  const styleWithKey = buildStyleWithKey()

  map = new maplibregl.Map({ 
    container: containerEl as any, 
    style: styleWithKey || '', 
    center: [0.5783, 40.7089], 
    zoom: 13,
    scrollZoom: false, // Desactivar zoom amb scroll
    dragRotate: false, // Desactivar rotació
    touchZoomRotate: true, // Permetre zoom amb touch
    doubleClickZoom: true, // Permetre zoom amb doble clic
  })

  // Afegir controls de navegació (botons +/-)
  map.addControl(new maplibregl.NavigationControl({
    showCompass: false, // Amagar brúixola (no hi ha rotació)
    visualizePitch: false
  }), 'top-right')

  map.on('load', () => {
    render()
    renderVehicles()
    emit('loaded')

    map.on('click', (e: any) => {
      emit('map-click', { lng: e.lngLat.lng, lat: e.lngLat.lat })
    })
  })

  map.on('error', (err: any) => console.error('MapLibre error', err))
})

watch(() => props.geofences, () => render(), { deep: true })
watch(() => props.vehicles, (v) => { internalVehicles.value = v || []; renderVehicles() }, { deep: true })

function flyTo(lng: number, lat: number, zoom = 14) {
  if (!map) return
  try { map.flyTo({ center: [lng, lat], zoom }) } catch (e) {}
}

function setSelectedMarker(lng: number, lat: number) {
  if (!map) return
  if (selectedMarker) {
    try { selectedMarker.setLngLat([lng, lat]) } catch (e) {}
  } else {
    selectedMarker = new maplibregl.Marker().setLngLat([lng, lat]).addTo(map)
  }
}

function removeSelectedMarker() {
  if (selectedMarker) {
    try { selectedMarker.remove() } catch (e) {}
    selectedMarker = null
  }
}

function updateVehicles(list: any[]) {
  internalVehicles.value = list || []
  renderVehicles()
}

function fitToAllVehicles() {
  if (!map || !internalVehicles.value || internalVehicles.value.length === 0) return
  
  const b = new maplibregl.LngLatBounds()
  let hasValidCoords = false
  
  internalVehicles.value.forEach((v: any) => {
    if (v.latitude != null && v.longitude != null) {
      const lat = Number(v.latitude)
      const lng = Number(v.longitude)
      if (!isNaN(lat) && !isNaN(lng)) {
        b.extend([lng, lat])
        hasValidCoords = true
      }
    }
  })
  
  if (hasValidCoords) {
    try {
      map.fitBounds(b, { padding: 80, maxZoom: 16 })
    } catch (e) {
      console.warn('Error fitToAllVehicles:', e)
    }
  }
}

defineExpose({ flyTo, setSelectedMarker, removeSelectedMarker, updateVehicles, fitToAllVehicles, clearVehicleMarkers })
</script>