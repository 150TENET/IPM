<script setup lang="ts">
import ThreeWayBar from '@/components/3WayBar.vue'
</script>

<template>
  <div class="layout-dashboard">
    <ThreeWayBar />

    <main class="content">
      <router-view />
    </main>
  </div>
</template>
