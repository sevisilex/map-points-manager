<template>
  <div class="popup-content p-1">
    <!-- Header with icon -->
    <div class="flex items-center gap-2 mb-3">
      <span
        class="text-xl flex items-center justify-center w-8 h-8 rounded-full"
        :style="{ backgroundColor: location.color ? MARKER_COLORS[location.color] : '#2196F3', color: location.color === 'white' ? '#AAAAAA' : '#FFFFFF' }"
      >
        <span class="material-icons marker-icon leading-none">{{ getIconName(location.iconType) }}</span>
      </span>
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
        {{ location.name }}
      </h3>
    </div>

    <!-- Content -->
    <div class="space-y-2 text-gray-600 dark:text-gray-300">
      <!-- Description -->
      <p v-if="location.description" class="text-sm italic border-l-2 border-gray-300 dark:border-gray-600 pl-3">
        {{ location.description }}
      </p>

      <!-- URL with better icon and layout -->
      <div v-if="location.url" class="flex items-center gap-2 mt-2">
        <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700">
          <span class="material-icons text-gray-600 dark:text-gray-300 text-sm">public</span>
        </span>
        <a
          :href="location.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline break-all flex-1"
        >
          {{ location.url }}
        </a>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="location.id && $emit('edit', location.id)"
        class="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
      >
        <span class="material-icons text-sm mr-2">edit</span>
        {{ t.edit }}
      </button>
      <button
        @click="location.id && $emit('delete', location.id)"
        class="inline-flex items-center px-3 py-1.5 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-200 text-sm"
      >
        <span class="material-icons text-sm mr-2">delete</span>
        {{ t.delete }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Location } from '../types/Location'
import { useI18n } from '../i18n'
import { getIconName, MARKER_COLORS } from '../constants/markerIcons'

defineProps<{
  location: Location
}>()

defineEmits<{
  edit: [id: number]
  delete: [id: number]
}>()

const { t } = useI18n()
</script>
