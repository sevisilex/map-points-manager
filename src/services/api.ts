import type { Location } from '../types/Location'
import { locationsDB } from '../db/database'

const FALLBACK_LOCATION: Omit<Location, 'id'> = {
  name: '[Demo] Failed to load demo.json',
  description:
    "This is a fallback demo point. It appears because the application could not load the demo.json file. Don't worry - you can still add your own locations!",
  iconType: 'hospital',
  color: 'red',
  latitude: 52.26475,
  longitude: 10.523597,
}

const loadDemoLocations = async (): Promise<Omit<Location, 'id'>[]> => {
  try {
    const response = await fetch('/demo.json')
    if (!response.ok) {
      throw new Error('Failed to load demo data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading demo locations:', error)
    return [FALLBACK_LOCATION]
  }
}

export const LocationsAPI = {
  async initialize() {
    const locations = await locationsDB.getLocations()
    if (locations.length === 0) {
      console.log('Initializing database with demo locations...')
      const demoLocations = await loadDemoLocations()
      for (const location of demoLocations) {
        await locationsDB.addLocation(location)
      }
    }
  },

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
      id,
    }

    await locationsDB.updateLocation(updatedLocation)
  },

  async delete(id: number): Promise<void> {
    await locationsDB.deleteLocation(id)
  },
}

// Initialize the database on startup
await locationsDB.init()
await LocationsAPI.initialize()
