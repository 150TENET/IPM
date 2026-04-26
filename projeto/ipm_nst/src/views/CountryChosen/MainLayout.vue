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
