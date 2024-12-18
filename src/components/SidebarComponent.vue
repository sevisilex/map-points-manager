<template>
  <div
    ref="sidebarContainer"
    class="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-all duration-300 absolute md:relative z-[1001] custom-scrollbar"
    :class="[isOpen ? 'w-[80%] sm:w-[50%] md:w-[30%] lg:w-[20%]' : 'w-0']"
  >
    <div class="flex-1 overflow-y-auto min-w-full" :class="{ invisible: !isOpen }">
      <div class="p-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-800 dark:text-white">{{ t.locationsList }}</h2>

        <div class="flex gap-2">
          <!-- Export -->
          <button @click="exportToCsv" class="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <span class="material-icons text-base">download</span>
          </button>

          <button
            @click="$emit('toggle')"
            class="p-1 text-gray-600 dark:text-gray-400 text-gray-800 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <span class="material-icons text-base">chevron_left</span>
          </button>
        </div>
      </div>

      <!-- List -->
      <div class="p-2 space-y-1">
        <div
          v-for="marker in markers"
          :key="marker.id"
          @click="marker.id && $emit('marker-click', marker.id)"
          class="p-1.5 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-1"
          :class="{
            'bg-blue-50 dark:bg-blue-900': selectedMarkerId === marker.id,
            'hover:bg-gray-50 dark:hover:bg-gray-700': selectedMarkerId !== marker.id,
          }"
        >
          <span class="text-base" :style="{ color: marker.color === 'white' ? '#AAAAAA' : MARKER_COLORS[marker.color || 'blue'] }">
            <span class="material-icons leading-none mr-1">{{ getIconName(marker.iconType) }}</span>
          </span>

          <div class="min-w-0 flex-1">
            <div class="font-medium text-sm text-gray-800 dark:text-white truncate">{{ marker.name }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate" v-if="marker.description">
              {{ marker.description.substring(0, 30) }}{{ marker.description.length > 30 ? '...' : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Location } from '../types/Location'
import { getIconName, MARKER_COLORS } from '../constants/markerIcons'
import { useI18n } from '../i18n'

const props = defineProps<{
  markers: Location[]
  selectedMarkerId: number | null
  isOpen: boolean
}>()

defineEmits<{
  'marker-click': [id: number]
  toggle: []
}>()

const { t } = useI18n()

const exportToCsv = () => {
  const headers = ['name', 'latitude', 'longitude', 'description', 'url', 'iconType', 'color']

  const csvContent = props.markers.map((marker) => {
    return headers
      .map((header) => {
        const value = marker[header as keyof Location] || ''
        const escapedValue = String(value).replace(/"/g, '""')
        return `"${escapedValue}"`
      })
      .join(',')
  })
  csvContent.unshift(headers.join(','))

  // Create and download CSV file
  const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'locations.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
/* Narrow scrollbar for WebKit (Chrome, Safari, newer versions of Edge) */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}
:deep(.dark) .custom-scrollbar {
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}
</style>
