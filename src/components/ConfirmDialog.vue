<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[2000]">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-md shadow-xl">
      <div class="text-center mb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ title }}</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="onCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="onConfirm"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-md transition-colors"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfirmDialog',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
  },
  emits: ['cancel', 'confirm'],
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onConfirm() {
      this.$emit('confirm')
    },
  },
})
</script>