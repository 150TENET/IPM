<script setup lang="ts">
import ThreeWayBar from '@/components/3WayBar.vue'
</script>

<template>
  <div class="layout-pie">
    <main class="content">
      <router-view name="top" /> <!-- Or keep it as <router-view /> if not using named views -->
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
  max-height: 350px; /* Change this value to whatever height you need */
  overflow-y: auto;  /* Adds a vertical scrollbar if the content overflows */
}

.layout-dashboard
{
  overflow-y: auto;
}
</style>
