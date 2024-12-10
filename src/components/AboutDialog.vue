<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[2000]">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-lg max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <span class="material-icons text-sm">density_medium</span>
            About This Map
          </h2>

          <p class="text-sm text-gray-600 dark:text-gray-400">Version 1.2.5</p>
        </div>
        <button @click="onClose" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <span class="material-icons">close</span>
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-6 text-gray-600 dark:text-gray-300">
        <!-- About -->
        <div class="prose dark:prose-invert">
          <p>
            This open-source project serves as my portfolio demonstration for job seeking. It showcases an interactive map where users can mark and manage
            locations with custom icons and descriptions.
          </p>

          <div class="mt-4 space-y-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Key Features:</h3>
            <ul class="list-disc pl-5">
              <li>Interactive map with custom markers and descriptions</li>
              <li>Dark/Light theme support</li>
              <li>Multi-language interface (DE/EN/PL)</li>
              <li>Data export to CSV</li>
              <li>Local data storage</li>
              <li>Responsive design</li>
            </ul>

            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Tech Stack:</h3>
            <ul class="list-disc pl-5">
              <li>Vue 3 + Vite</li>
              <li>Tailwind CSS</li>
              <li>Leaflet with OpenStreetMap</li>
              <li>IndexedDB for storage</li>
            </ul>
          </div>

          <div class="mt-6">
            <p class="flex items-center gap-2">
              Coded by
              <a
                href="https://github.com/sevisilex/map-points-manager"
                target="_blank"
                class="text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Dariusz Krzeminski</a
              ><!--, Hosted on Netlify -->
            </p>
          </div>
        </div>

        <!-- Buy Me Coffee Button -->
        <div class="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">If you're happy with this project, consider buying me a coffee!</p>
          <a
            href="https://ko-fi.com/svslx"
            target="_blank"
            class="inline-flex items-center px-6 py-3 bg-[#FFDD00] text-gray-900 rounded-lg hover:bg-[#FFED4A] transition-colors shadow-md group"
          >
            <span class="relative">
              <span class="material-icons mr-2 transition-opacity duration-300 ease-in-out group-hover:opacity-0">coffee</span>
              <span
                class="material-icons mr-2 text-red-500 absolute left-0 top-0 opacity-0 transition-all duration-300 ease-in-out scale-0 rotate-0 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12"
                >favorite</span
              >
            </span>
            Buy me a coffee
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutDialog',

  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['update:show'],

  methods: {
    onClose() {
      this.$emit('update:show', false)
    },
  },
})
</script>
