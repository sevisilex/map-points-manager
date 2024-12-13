<template>
  <div class="absolute top-4 left-4 z-[1000]">
    <!-- Open Siderbar Button -->
    <button
      v-if="!isSidebarOpen"
      @click="$emit('toggle-sidebar')"
      class="px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 ease-in-out shadow-md"
    >
      <span class="material-icons text-sm">chevron_right</span>
    </button>
  </div>

  <div class="absolute top-4 right-4 z-[1000] flex gap-2">
    <!-- Point Button -->
    <button
      @click="$emit('add-point')"
      class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 ease-in-out shadow-md"
    >
      {{ t.addPoint }}
      <span class="material-icons text-sm pl-2">add_location_alt</span>
    </button>

    <!-- About Button -->
    <button
      @click="$emit('show-about')"
      class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 shadow-md"
      :title="t.about"
    >
      <span class="material-icons text-sm transition-opacity duration-300 ease-in-out group-hover:opacity-0">density_medium</span>
    </button>

    <!-- Dark mode Button -->
    <button
      @click="$emit('toggle-dark-mode')"
      class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 ease-in-out shadow-md"
    >
      <span class="material-icons text-sm">{{ isDarkMode ? 'dark_mode' : 'light_mode' }}</span>
    </button>
  </div>

  <!-- Buy Me Coffee Button -->
  <div class="absolute bottom-8 right-4 z-[1000]">
    <a
      href="https://ko-fi.com/svslx"
      target="_blank"
      class="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-[#FFED4A] dark:hover:hover:bg-[#FFED4A] dark:hover:text-gray-900 transition-colors duration-300 shadow-md group"
    >
      <span class="relative">
        <span class="material-icons mr-2 transition-opacity duration-300 ease-in-out group-hover:opacity-0">coffee</span>
        <span
          class="material-icons mr-2 text-red-500 absolute left-0 top-0 opacity-0 transition-all duration-300 ease-in-out scale-0 rotate-0 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12"
          >favorite</span
        >
      </span>
      {{ t.coffeeButton }}
    </a>
  </div>

  <div class="absolute bottom-3 left-16 z-[1000]">
    <!-- Language Selector -->

    <select
      v-model="currentLang"
      @change="handleLanguageChange"
      class="appearance-none px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 ease-in-out shadow-md cursor-pointer"
    >
      <option value="de">Deutsch</option>
      <option value="en">English</option>
      <option value="pl">Polski</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '../i18n'

defineProps<{
  isDarkMode: boolean
  isSidebarOpen: boolean
}>()

defineEmits<{
  'add-point': []
  'toggle-dark-mode': []
  'toggle-sidebar': []
  'show-about': []
}>()

const { t, setLanguage, getLanguage, initializeLanguage } = useI18n()
const currentLang = ref(getLanguage())

onMounted(() => {
  initializeLanguage()
  currentLang.value = getLanguage()
})

const handleLanguageChange = () => {
  setLanguage(currentLang.value)
}
</script>
