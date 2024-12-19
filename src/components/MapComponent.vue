<template>
  <div class="relative w-full h-full flex">
    <!-- Sidebar -->
    <SidebarComponent
      ref="sidebar"
      :markers="locationsList"
      :selected-marker-id="selectedMarkerId"
      :is-open="isSidebarOpen"
      @marker-click="handleMarkerClick"
      @toggle="toggleSidebar"
    />

    <div class="flex-1 relative" Xmousedown="handleMapClick">
      <div id="map" class="w-full h-full"></div>

      <LocationDialog
        v-model:show="showDialog"
        :loading="loading"
        :editing-marker="selectedMarkerId"
        :current-marker="currentMarker"
        :is-dark-mode="isDarkMode"
        @save="saveMarker"
      />

      <AboutDialog v-model:show="showAboutDialog" />

      <ConfirmDialog v-model:config="confirmDialogConfig" />

      <Controls
        :is-dark-mode="isDarkMode"
        :is-sidebar-open="isSidebarOpen"
        @add-point="openAddMarkerForm"
        @toggle-dark-mode="toggleDarkMode"
        @toggle-sidebar="toggleSidebar"
        @show-about="showAboutDialog = true"
      />
    </div>

    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-[1000] md:hidden" @click="toggleSidebar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createApp, h } from 'vue'
import L, { Point } from 'leaflet'
import type { Location } from '../types/Location'
import { LocationsAPI } from '../services/api'
import { MARKER_COLORS, createMarkerIcon } from '../constants/markerIcons'
import LocationDialog from './LocationDialog.vue'
import LocationPopup from './LocationPopup.vue'
import SidebarComponent from './SidebarComponent.vue'
import type { ConfirmDialogConfig } from './ConfirmDialog.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import Controls from './Controls.vue'
import AboutDialog from './AboutDialog.vue'
import { useI18n } from '../i18n'
import { isDarkModeStorage, setDarkModeStorage, setSidebarOpenStorage } from '../services/storage'

const { t } = useI18n()

// State
const map = ref<L.Map | null>(null)
const markers = ref(new Map<number, L.Marker>())
const showDialog = ref(false)
const isDarkMode = ref(false)
const showAboutDialog = ref(false)
const confirmDialogConfig = ref<ConfirmDialogConfig | null>(null)
const isSidebarOpen = ref(false)
const locationsList = ref<Location[]>([])
const selectedMarkerId = ref<number | null>(null)
const loading = ref(false)

const currentMarker = ref<Location>({
  name: '',
  url: '',
  latitude: 0,
  longitude: 0,
  description: '',
  iconType: 'default',
  color: 'blue',
})

// Methods
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
  setDarkModeStorage(isDarkMode.value)
  updateMap()
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  setSidebarOpenStorage(isSidebarOpen.value)
}

const handleMarkerClick = async (markerId: number) => {
  selectedMarkerId.value = markerId
  const marker = markers.value.get(markerId)
  if (marker && map.value) {
    map.value.setView(marker.getLatLng(), map.value.getZoom() || 13)
    marker.openPopup()
  }
}

const loadMarkers = async () => {
  try {
    locationsList.value = await LocationsAPI.getAll()
    locationsList.value.forEach((location) => {
      if (location.id) {
        addMarkerToMap(location)
      }
    })
  } catch (error) {
    console.error('Error loading points:', error)
  }
}

const openAddMarkerForm = () => {
  if (!map.value) return

  const center = map.value.getCenter()
  currentMarker.value = {
    name: '',
    url: '',
    latitude: center.lat || import.meta.env.VITE_DEFAULT_LAT,
    longitude: center.lng || import.meta.env.VITE_DEFAULT_LNG,
    description: '',
    iconType: 'default',
    color: 'blue',
  }
  selectedMarkerId.value = null
  showDialog.value = true
}

const getPopupTemplate = (location: Location) => {
  const container = document.createElement('div')
  const app = createApp({
    render() {
      return h(LocationPopup, {
        location,
        onEdit: (id: number) => window.editLocation(id),
        onDelete: (id: number) => window.deleteLocation(id),
      })
    },
  })
  app.mount(container)
  return container
}

const saveMarker = async (location: Location) => {
  try {
    const locationData = {
      name: location.name,
      url: location.url,
      latitude: location.latitude,
      longitude: location.longitude,
      description: location.description || '',
      iconType: location.iconType || 'default',
      color: location.color || 'blue',
    }

    if (selectedMarkerId.value) {
      await LocationsAPI.update(selectedMarkerId.value, locationData)
      const marker = markers.value.get(selectedMarkerId.value)
      if (marker) {
        marker.setLatLng([locationData.latitude, locationData.longitude])
        const newIcon = createMarkerIcon(locationData.iconType, MARKER_COLORS[locationData.color])
        marker.setIcon(newIcon)
        marker.setPopupContent(getPopupTemplate({ ...locationData, id: selectedMarkerId.value }))
      }
    } else {
      const result = await LocationsAPI.create(locationData)
      const newLocation = { ...locationData, id: result.id }
      addMarkerToMap(newLocation)
    }

    locationsList.value = await LocationsAPI.getAll()
    showDialog.value = false
    selectedMarkerId.value = null
  } catch (error) {
    console.error('Error saving point:', error)
  }
}

const addMarkerToMap = (location: Location) => {
  if (!map.value || !location.id) {
    return
  }

  const markerIcon = createMarkerIcon(location.iconType || 'default', MARKER_COLORS[location.color || 'blue'])

  const marker = L.marker([location.latitude, location.longitude], {
    draggable: true,
    icon: markerIcon,
  })
    .addTo(map.value as L.Map)
    .bindPopup(getPopupTemplate(location))

  marker.on('dragend', async () => {
    const newPosition = marker.getLatLng()
    try {
      if (location.id) {
        await LocationsAPI.update(location.id, {
          ...location,
          latitude: newPosition.lat,
          longitude: newPosition.lng,
        })
        location.latitude = newPosition.lat
        location.longitude = newPosition.lng
      }
    } catch (error) {
      console.error('Error updating position:', error)
      marker.setLatLng([location.latitude, location.longitude])
    }
  })

  marker.on('dragstart', () => {
    marker.closePopup()
    marker.bindTooltip(t.value.dragToChange, {
      permanent: true,
      offset: new Point(0, -32),
      direction: 'top',
    })
  })

  marker.on('dragend', () => {
    marker.unbindTooltip()
  })

  if (location.id) {
    markers.value.set(location.id, marker)
  }
}

const updateMap = () => {
  if (!map.value) {
    map.value = L.map('map', { zoomControl: false, minZoom: 3, doubleClickZoom: false }).setView(
      [import.meta.env.VITE_DEFAULT_LAT || 52.265040754253896, import.meta.env.VITE_DEFAULT_LNG || 10.521526343654843],
      import.meta.env.VITE_DEFAULT_ZOOM || 13
    )
    L.control
      .zoom({
        position: 'bottomleft',
      })
      .addTo(map.value as L.Map)
  }

  // Update map tiles for dark mode
  if (map.value) {
    map.value.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        layer.remove()
      }
    })

    L.tileLayer(isDarkMode.value ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: isDarkMode.value ? '© OpenStreetMap contributors, © CARTO' : '© OpenStreetMap contributors',
    }).addTo(map.value as L.Map)
  }
}

const initTheme = () => {
  isDarkMode.value = isDarkModeStorage()
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }
}

// Lifecycle hooks
onMounted(async () => {
  initTheme()
  updateMap()

  if (map.value) {
    map.value.on('dblclick', (e) => {
      const { lat, lng } = e.latlng
      currentMarker.value = {
        name: '',
        url: '',
        latitude: lat,
        longitude: lng,
        description: '',
        iconType: 'default',
        color: 'blue',
      }
      selectedMarkerId.value = null
      showDialog.value = true
    })
  }

  window.editLocation = async (id: number) => {
    const marker = markers.value.get(id)
    if (marker) {
      try {
        loading.value = true
        const locationData = await LocationsAPI.getById(id)
        selectedMarkerId.value = id
        currentMarker.value = {
          ...locationData,
          iconType: locationData.iconType || 'default',
          color: locationData.color || 'blue',
        }
        showDialog.value = true
      } catch (error) {
        console.error('Error getting location data:', error)
      } finally {
        loading.value = false
      }
    }
  }

  window.deleteLocation = async (id: number) => {
    selectedMarkerId.value = id
    confirmDialogConfig.value = {
      title: t.value.confirm,
      message: t.value.confirmDelete,
      confirmText: t.value.delete,
      cancelText: t.value.cancel,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await LocationsAPI.delete(id)
          locationsList.value = await LocationsAPI.getAll()
          const marker = markers.value.get(id)
          if (marker) {
            marker.remove()
            markers.value.delete(id)
          }
        } catch (error) {
          console.error('Error deleting point:', error)
        }
      },
      onCancel: () => {
        selectedMarkerId.value = null
      },
    }
  }

  const shouldImportDemo = await LocationsAPI.isDatabaseEmpty()
  if (shouldImportDemo) {
    await new Promise<void>((resolve) => {
      confirmDialogConfig.value = {
        title: t.value.emptyDatabaseTitle,
        message: t.value.emptyDatabaseMessage,
        confirmText: t.value.importDemo,
        cancelText: t.value.skipDemo,
        onConfirm: async () => {
          await LocationsAPI.loadDemoLocations()
          await loadMarkers()
          resolve()
        },
        onCancel: () => {
          resolve()
        },
      }
    })
  } else {
    await loadMarkers()
  }

  setTimeout(() => {
    showAboutDialog.value = true
    isSidebarOpen.value = true
  }, 3000)
})
</script>

<style lang="scss">
@import 'leaflet/dist/leaflet.css';

.material-icons {
  @apply select-none;
}

.material-icons {
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
}

/* Custom marker styles */
.custom-div-icon div {
  @apply rounded-full border-2 border-white shadow-lg flex items-center justify-center;
  background-color: var(--marker-color, #2196f3);
}

.marker-icon {
  @apply text-lg flex items-center justify-center;
}

/* Leaflet tooltip customization */
.leaflet-popup-content-wrapper {
  @apply rounded-lg shadow-lg dark:bg-gray-800;
}

.leaflet-popup-content {
  @apply m-0 p-3;
}

.leaflet-tooltip {
  @apply bg-gray-800 text-white border-0 px-2 py-1 rounded text-xs;
}

.leaflet-tooltip-top:before {
  @apply border-t-gray-800;
}

.leaflet-touch .leaflet-bar {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  border: 2px solid transparent;
  a {
    width: 36px;
    height: 36px;
    line-height: 36px;
  }
}

.leaflet-popup-content-wrapper {
  @apply dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-0;
}

.leaflet-popup-tip {
  @apply dark:bg-gray-800;
}
</style>
