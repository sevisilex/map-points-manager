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
        :editing-marker="editingMarker"
        :current-marker="currentMarker"
        :is-dark-mode="isDarkMode"
        @save="saveMarker"
      />

      <AboutDialog v-model:show="showAboutDialog" />

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

<script lang="ts">
import { createApp, defineComponent, h } from 'vue'
import L from 'leaflet'
import type { Location } from '../types/Location'
import { LocationsAPI } from '../services/api'
import { MARKER_COLORS, ICON_LABELS, createMarkerIcon } from '../constants/markerIcons'
import LocationDialog from './LocationDialog.vue'
import LocationPopup from './LocationPopup.vue'
import SidebarComponent from './SidebarComponent.vue'
import Controls from './Controls.vue'
import AboutDialog from './AboutDialog.vue'
import { useI18n } from '../i18n'
import type { TranslationType } from '../i18n'

export default defineComponent({
  name: 'MapComponent',
  components: {
    LocationDialog,
    Controls,
    SidebarComponent,
    AboutDialog,
  },

  data() {
    const { t } = useI18n()
    return {
      t,
      map: null as L.Map | null,
      markers: new Map<number, L.Marker>(),
      showDialog: false,
      editingMarker: null as number | null,
      isDarkMode: false,

      currentMarker: {
        name: '',
        url: '',
        latitude: 0,
        longitude: 0,
        description: '',
        iconType: 'default',
        color: 'blue',
      } as Location,
      loading: false,

      isSidebarOpen: false,
      locationsList: [] as Location[],
      selectedMarkerId: null as number | null,
      showAboutDialog: false,

      MARKER_COLORS,
      ICON_LABELS,
    }
  },

  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      document.documentElement.classList.toggle('dark')
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light')

      this.updateMap()
    },

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
      localStorage.setItem('sidebar-state', this.isSidebarOpen ? 'open' : 'closed')
    },

    async handleMarkerClick(markerId: number) {
      this.selectedMarkerId = markerId
      const marker = this.markers.get(markerId)
      if (marker) {
        // const location = await LocationsAPI.getById(markerId)
        this.map?.setView(marker.getLatLng(), this.map.getZoom() || 13)
        marker.openPopup()
      }
    },

    async loadMarkers() {
      try {
        const locations = await LocationsAPI.getAll()
        this.locationsList = locations // Store locations for sidebar
        locations.forEach((location) => {
          if (location.id) {
            this.addMarkerToMap(location)
          }
        })
      } catch (error) {
        console.error('Error loading points:', error)
      }
    },

    openAddMarkerForm() {
      if (!this.map) return

      const center = this.map.getCenter()
      this.currentMarker = {
        name: '',
        url: '',
        latitude: center.lat,
        longitude: center.lng,
        description: '',
        iconType: 'default',
        color: 'blue',
      }
      this.editingMarker = null
      this.showDialog = true
    },

    getPopupTemplate(location: Location) {
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
    },

    async saveMarker(location: Location) {
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

        if (this.editingMarker) {
          await LocationsAPI.update(this.editingMarker, locationData)
          const marker = this.markers.get(this.editingMarker)
          if (marker) {
            marker.setLatLng([locationData.latitude, locationData.longitude])
            const newIcon = createMarkerIcon(locationData.iconType, MARKER_COLORS[locationData.color])
            marker.setIcon(newIcon)
            console.log('this.editingMarker', this.editingMarker)
            console.log('locationData', locationData)
            marker.setPopupContent(this.getPopupTemplate({ ...locationData, id: this.editingMarker }))
          }
        } else {
          const result = await LocationsAPI.create(locationData)
          const newLocation = { ...locationData, id: result.id }
          this.addMarkerToMap(newLocation)
        }

        this.showDialog = false
        this.editingMarker = null
      } catch (error) {
        console.error('Error saving point:', error)
      }
    },

    addMarkerToMap(location: Location) {
      if (!this.map || !location.id) return

      const markerIcon = createMarkerIcon(location.iconType || 'default', MARKER_COLORS[location.color || 'blue'])

      const marker = L.marker([location.latitude, location.longitude], {
        draggable: true,
        icon: markerIcon,
      })
        .addTo(this.map)
        .bindPopup(this.getPopupTemplate(location))

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
        marker.bindTooltip((this.t as TranslationType).dragToChange, {
          permanent: true,
          direction: 'top',
        })
      })

      marker.on('dragend', () => {
        marker.unbindTooltip()
      })

      this.markers.set(location.id, marker)
    },

    async deleteLocation(id: number) {
      if (confirm((this.t as TranslationType).confirmDelete)) {
        try {
          await LocationsAPI.delete(id)
          const marker = this.markers.get(id)
          if (marker) {
            marker.remove()
            this.markers.delete(id)
          }
        } catch (error) {
          console.error('Error deleting point:', error)
        }
      }
    },

    updateMap() {
      if (!this.map) {
        this.map = L.map('map', { zoomControl: false, minZoom: 3, doubleClickZoom: false }).setView([52.265040754253896, 10.521526343654843], 13)
        L.control
          .zoom({
            position: 'bottomleft',
          })
          .addTo(this.map)
      }

      // Update map tiles for dark mode
      if (this.map) {
        this.map.eachLayer((layer) => {
          if (layer instanceof L.TileLayer) {
            layer.remove()
          }
        })

        L.tileLayer(this.isDarkMode ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: this.isDarkMode ? '© OpenStreetMap contributors, © CARTO' : '© OpenStreetMap contributors',
        }).addTo(this.map)
      }
    },

    initTheme() {
      const theme = localStorage.getItem('theme')
      this.isDarkMode = theme === 'dark'
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark')
      }
    },
  },

  async mounted() {
    this.initTheme()
    this.updateMap()

    this.map.on('dblclick', (e) => {
      const { lat, lng } = e.latlng
      this.currentMarker = {
        name: '',
        url: '',
        latitude: lat,
        longitude: lng,
        description: '',
        iconType: 'default',
        color: 'blue',
      }
      this.editingMarker = null
      this.showDialog = true

      const sidebarState = localStorage.getItem('sidebar-state')
      this.isSidebarOpen = sidebarState === 'open'
    })

    window.editLocation = async (id: number) => {
      const marker = this.markers.get(id)
      if (marker) {
        try {
          this.loading = true
          const locationData = await LocationsAPI.getById(id)
          this.editingMarker = id
          this.currentMarker = {
            ...locationData,
            iconType: locationData.iconType || 'default',
            color: locationData.color || 'blue',
          }
          this.showDialog = true
        } catch (error) {
          console.error('Error getting location data:', error)
        } finally {
          this.loading = false
        }
      }
    }

    window.deleteLocation = this.deleteLocation.bind(this)

    await this.loadMarkers()

    setTimeout(() => {
      this.showAboutDialog = true
    }, 3000)
  },
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

// .leaflet-control-zoom {
//   // position: fixed !important;
//   bottom: 20px !important;
//   // left: 20px !important;
//   top: auto !important;
// }

// .leaflet-control-zoom a {
//   @apply bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700;
//   &:hover {
//     @apply bg-gray-50 dark:bg-gray-700;
//   }
// }
</style>
