export type Geofence = {
  geofence_id: number
  name: string
  description?: string
  type?: string
  center_latitude?: number
  center_longitude?: number
  radius?: number
  polygon_coordinates?: any // JSON stored on server (GeoJSON or array)
}
