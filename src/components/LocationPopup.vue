<template>
  <div class="popup-content p-1">
    <!-- Header with icon -->
    <div class="flex items-center gap-2 mb-3">
      <span
        class="text-xl flex items-center justify-center w-8 h-8 rounded-full"
        :style="{ backgroundColor: location.color ? MARKER_COLORS[location.color] : '#2196F3', color: location.color === 'white' ? '#000000' : '#FFFFFF' }"
      >
        <i :class="`mdi mdi-${getIconName(location.iconType)} leading-none`"></i>
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
          <i class="mdi mdi-earth text-gray-600 dark:text-gray-300 text-sm"></i>
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
        @click="$emit('edit', location.id)"
        class="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
      >
        <i class="mdi mdi-pencil text-sm mr-1"></i>
        {{ t.edit }}
      </button>
      <button
        @click="$emit('delete', location.id)"
        class="inline-flex items-center px-3 py-1.5 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-200 text-sm"
      >
        <i class="mdi mdi-delete text-sm mr-1"></i>
        {{ t.delete }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { Location } from '../types/Location'
import { useI18n } from '../i18n'
import { getIconName, MARKER_COLORS } from '../constants/markerIcons'

export default defineComponent({
  name: 'LocationPopup',
  props: {
    location: {
      type: Object as PropType<Location>,
      required: true,
    },
  },
  data() {
    const { t } = useI18n()
    return {
      t,
      MARKER_COLORS,
    }
  },
  methods: {
    getIconName,
  },
  emits: ['edit', 'delete'],
})
</script>
