<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[2000]">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">
        {{ editingMarker ? t.editPoint : t.addNewPoint }}
      </h2>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">{{ t.loading }}</div>

      <!-- Form -->
      <form v-else @submit.prevent="onSave" class="space-y-4">
        <!-- Name Field -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ t.name }}:</label>
          <input
            v-model="formData.name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <!-- Description Field -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ t.description }}:</label>
          <textarea
            v-model="formData.description"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-y dark:bg-gray-700 dark:text-white dark:border-gray-600"
          ></textarea>
        </div>

        <!-- URL Field -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ t.url }}:</label>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-gray-500 dark:text-gray-400">
              <span class="mdi mdi-earth text-lg"></span>
            </span>
            <input
              v-model="formData.url"
              placeholder="https://"
              type="url"
              class="w-full pl-10 pr-10 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <button v-if="formData.url" @click.prevent="openUrl" class="absolute right-3 text-blue-500 hover:text-blue-600 dark:text-blue-400">
              <span class="mdi mdi-open-in-new text-lg"></span>
            </button>
          </div>
        </div>

        <!-- Icon Selector -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ t.icon }}:</label>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800">
            <div
              v-for="(type, key) in ICON_LABELS"
              :key="key"
              class="flex flex-col items-center p-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              :class="{ 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500': formData.iconType === key }"
              @click="selectIcon(key)"
            >
              <span class="text-2xl dark:text-white" v-html="getIconPreview(key)"></span>
              <span class="text-xs text-center mt-1 dark:text-gray-300">{{ t.icons[key] }}</span>
            </div>
          </div>
        </div>

        <!-- Color Selector -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ t.color }}:</label>
          <div class="grid grid-cols-4 gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800">
            <div
              v-for="(color, key) in MARKER_COLORS"
              :key="key"
              class="h-10 rounded cursor-pointer flex items-center justify-center text-xs"
              :class="{
                'ring-2 ring-offset-2 ring-gray-800 dark:ring-white': formData.color === key,
                'text-black': key === 'white',
                'text-white': key !== 'white',
                'ring-offset-gray-800': formData.color === key && isDarkMode,
              }"
              :style="{ backgroundColor: color }"
              @click="selectColor(key)"
            >
              <span>{{ t.colors[key] }}</span>
            </div>
          </div>
        </div>

        <!-- Form Buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="onClose"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:bg-gray-800"
          >
            {{ t.cancel }}
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800">
            {{ t.save }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from '../i18n'
import { MARKER_COLORS, ICON_LABELS } from '../constants/markerIcons'
import type { Location } from '../types/Location'

export default defineComponent({
  name: 'LocationDialog',

  props: {
    show: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    editingMarker: {
      type: Number as PropType<number | null>,
      default: null,
    },
    currentMarker: {
      type: Object as () => Location,
      required: true,
    },
    isDarkMode: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const { t } = useI18n()
    return {
      t,
      MARKER_COLORS,
      ICON_LABELS,
      formData: {
        name: '',
        url: '',
        description: '',
        iconType: 'default',
        color: 'blue',
        latitude: 0,
        longitude: 0,
      } as Location,
    }
  },

  watch: {
    currentMarker: {
      immediate: true,
      handler(newVal: Location) {
        this.formData = { ...newVal }
      },
    },
  },

  methods: {
    onClose() {
      this.$emit('update:show', false)
    },

    onSave() {
      this.$emit('save', this.formData)
    },

    selectIcon(type: string) {
      this.formData.iconType = type
    },

    selectColor(color: string) {
      this.formData.color = color
    },

    openUrl() {
      if (this.formData.url) {
        window.open(this.formData.url, '_blank')
      }
    },

    getIconPreview(type: string) {
      const iconConfig: { [key: string]: string } = {
        default: 'map-marker',
        home: 'home',
        shop: 'shopping',
        restaurant: 'silverware-fork-knife',
        school: 'school',
        hospital: 'hospital',
        park: 'nature',
        gym: 'dumbbell',
        cafe: 'coffee',
        office: 'office-building',
        parking: 'parking',
      }
      return `<span class="mdi mdi-${iconConfig[type] || 'map-marker'}"></span>`
    },
  },
})
</script>
