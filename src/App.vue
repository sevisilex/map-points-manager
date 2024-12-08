<template>
  <router-view class="h-full w-full"></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>

<style>
html,
body {
  @apply m-0 p-0 h-full w-full bg-transparent;
}

#app {
  @apply h-full w-full;
}
</style>
