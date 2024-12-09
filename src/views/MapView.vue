<template>
  <div class="h-full">
    <MapComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MapComponent from '../components/MapComponent.vue'

export default defineComponent({
  name: 'MapView',
  components: {
    MapComponent,
  },
})
</script>
