<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <aside class="execution-card">
    <span class="execution-card__label">{{ label }}</span>
  </aside>
</template>

<style scoped>
.execution-card {
  background: white;
  border-radius: 14px;
  padding: 18px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 320px;
  text-align: center;
}

.execution-card__label {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a2a5e;
}
</style>
