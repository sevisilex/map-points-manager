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
      class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 shadow-md group"
      :title="t.about"
    >
      <span class="relative">
        <span class="material-icons text-sm transition-opacity duration-300 ease-in-out group-hover:opacity-0">coffee</span>
        <span
          class="material-icons text-sm text-red-500 absolute left-0 top-0 opacity-0 transition-all duration-300 ease-in-out scale-0 rotate-0 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12"
          >favorite</span
        >
      </span>
    </button>

    <!-- Dark mode Button -->
    <button
      @click="$emit('toggle-dark-mode')"
      class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 ease-in-out shadow-md"
    >
      <span class="material-icons text-sm">{{ isDarkMode ? 'dark_mode' : 'light_mode' }}</span>
    </button>
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

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from '../i18n'

export default defineComponent({
  name: 'Controls',

  props: {
    isDarkMode: {
      type: Boolean,
      required: true,
    },
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    const { t, setLanguage, getLanguage, initializeLanguage } = useI18n()
    return {
      t,
      currentLang: getLanguage(),
      setLanguage,
      getLanguage,
      initializeLanguage,
    }
  },

  mounted() {
    this.initializeLanguage()
    this.currentLang = this.getLanguage()
  },

  methods: {
    handleLanguageChange() {
      this.setLanguage(this.currentLang)
    },
  },

  emits: ['add-point', 'toggle-dark-mode', 'toggle-sidebar', 'show-about'],
})
</script>
