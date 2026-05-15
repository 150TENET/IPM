<script setup lang="ts">
import ThreeWayBar from '@/components/3WayBar.vue'
</script>

<template>
  <div class="layout-pie">
    <main class="content">
      <router-view name="top" />
    </main>
  </div>
  <ThreeWayBar />
  <div class="layout-dashboard">
    <main class="content">
      <router-view name="default" />
    </main>
  </div>
</template>

<style scoped>
.layout-pie {
  max-height: 350px;
  overflow-y: auto;
}

.layout-dashboard {
  overflow-y: auto;
}
</style>