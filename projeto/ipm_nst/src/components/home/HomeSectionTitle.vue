<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="home-section-title">
    <p v-if="subtitle" class="home-section-title__eyebrow">{{ subtitle }}</p>
    <h2 class="home-section-title__title">{{ title }}</h2>
  </header>
</template>

<style scoped>
.home-section-title {
  display: grid;
  gap: 6px;
}

.home-section-title__eyebrow {
  margin: 0;
  color: #5f6fb2;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.home-section-title__title {
  margin: 0;
  color: #1a2a5e;
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.35;
}
</style>
