<template>
  <div v-if="config" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[2000]">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-md shadow-xl">
      <div class="text-center mb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ config.title }}</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ config.message }}</p>
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="onCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
        >
          {{ config.cancelText }}
        </button>
        <button
          @click="onConfirm"
          :class="[
            'px-4 py-2 text-sm font-medium text-white rounded-md transition-colors',
            config.variant === 'danger'
              ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
          ]"
        >
          {{ config.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export interface ConfirmDialogConfig {
  title: string
  message: string
  confirmText: string
  cancelText: string
  variant?: 'danger' | 'primary'
  onConfirm: () => Promise<void>
  onCancel?: () => void
}

export default defineComponent({
  name: 'ConfirmDialog',
  props: {
    config: {
      type: Object as PropType<ConfirmDialogConfig | null>,
      default: null,
    },
  },
  emits: ['update:config'],
  methods: {
    async onConfirm() {
      if (this.config) {
        await this.config.onConfirm()
        this.$emit('update:config', null)
      }
    },
    onCancel() {
      if (this.config?.onCancel) {
        this.config.onCancel()
      }
      this.$emit('update:config', null)
    },
  },
})
</script>
