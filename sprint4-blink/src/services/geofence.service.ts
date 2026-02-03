import type { Geofence } from '../types/geofence.types'
import { apiClient } from './api.service'

export const geofenceService = {
  async list(): Promise<Geofence[]> {
    return await apiClient.get<Geofence[]>('/v1/geofences')
  },
  async create(data: Partial<Geofence>): Promise<Geofence> {
    return await apiClient.post<Geofence>('/v1/geofences', data)
  },
}
