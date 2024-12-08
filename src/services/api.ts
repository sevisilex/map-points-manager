import type { Location } from '../types/Location'
import { locationsDB } from '../db/database'

// Initialize the database on startup
await locationsDB.init()

export const LocationsAPI = {
  async getAll(): Promise<Location[]> {
    return locationsDB.getLocations()
  },

  async getById(id: number): Promise<Location> {
    const location = await locationsDB.getLocationById(id)
    if (!location) {
      throw new Error(`Location with id ${id} not found`)
    }
    return location
  },

  async create(location: Omit<Location, 'id'>): Promise<{ id: number }> {
    const id = await locationsDB.addLocation(location)
    return { id }
  },

  async update(id: number, location: Partial<Location>): Promise<void> {
    const existingLocation = await locationsDB.getLocationById(id)
    if (!existingLocation) {
      throw new Error(`Location with id ${id} not found`)
    }

    const updatedLocation: Location = {
      ...existingLocation,
      ...location,
      id
    }

    await locationsDB.updateLocation(updatedLocation)
  },

  async delete(id: number): Promise<void> {
    await locationsDB.deleteLocation(id)
  }
}