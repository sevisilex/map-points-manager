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
              <span class="material-icons text-lg">public</span>
            </span>
            <input
              v-model="formData.url"
              placeholder="https://"
              type="url"
              class="w-full pl-10 pr-10 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <button v-if="formData.url" @click.prevent="openUrl" class="absolute right-3 text-blue-500 hover:text-blue-600 dark:text-blue-400">
              <span class="material-icons text-lg">launch</span>
            </button>
          </div>
        </div>

        <!-- Icon Selector -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ t.icon }}:</label>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800">
            <div
              v-for="(_, key) in MARKER_ICONS"
              :key="key"
              class="flex flex-col items-center p-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              :class="{ 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500': formData.iconType === key }"
              @click="selectIcon(key)"
            >
              <span class="text-2xl dark:text-white">
                <span class="material-icons leading-none">{{ getIconName(key) }}</span>
              </span>
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

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { TranslationColorType, TranslationIconType, useI18n } from '../i18n'
import { MARKER_COLORS, MARKER_ICONS, getIconName } from '../constants/markerIcons'
import type { Location } from '../types/Location'

const props = defineProps<{
  show: boolean
  loading?: boolean
  editingMarker?: number | null
  currentMarker: Location
  isDarkMode?: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  save: [data: Location]
}>()

const { t } = useI18n()

const formData = ref<Location>({
  name: '',
  url: '',
  description: '',
  iconType: 'default',
  color: 'blue',
  latitude: 0,
  longitude: 0,
})

watch(
  () => props.currentMarker,
  (newVal: Location) => {
    formData.value = { ...newVal }
  },
  { immediate: true }
)

const onClose = () => {
  emit('update:show', false)
}

const onSave = () => {
  emit('save', formData.value)
}

const selectIcon = (type: keyof TranslationIconType) => {
  formData.value.iconType = type
}

const selectColor = (color: keyof TranslationColorType) => {
  formData.value.color = color
}

const openUrl = () => {
  if (formData.value.url) {
    window.open(formData.value.url, '_blank')
  }
}
</script>
