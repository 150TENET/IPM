<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color: string; // Agora passamos apenas 'blue' ou 'green'
}>();
</script>

<template>
  <div class="card">
    <div :class="['icon-box', color]">
      <span class="material-icons">{{ icon }}</span>
    </div>
    <div class="content">
      <p class="title">{{ title }}</p>
      <h3 class="value">{{ value }}</h3>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  min-width: 250px;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Cores que batem com o prop 'color' */
.blue { background-color: #eff6ff; color: #2563eb; }
.green { background-color: #ecfdf5; color: #10b981; }

.content {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.title {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  font-family: sans-serif;
}

.value {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  font-family: sans-serif;
}

.subtitle {
  color: #9ca3af;
  font-size: 0.75rem;
  margin: 0;
  font-family: sans-serif;
}
</style>
