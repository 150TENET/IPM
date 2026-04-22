<script setup lang="ts">
import { computed } from 'vue'
import type { PieSegment } from '@/views/CountryChosen/marcosAndMetas.data'

const props = defineProps<{
  title: string
  subtitle: string
  segments: PieSegment[]
}>()

const total = computed(() => props.segments.reduce((sum, segment) => sum + segment.value, 0))

const pieStyle = computed(() => {
  let start = 0

  const slices = props.segments.map((segment) => {
    const percent = (segment.value / total.value) * 100
    const end = start + percent
    const part = `${segment.color} ${start}% ${end}%`
    start = end
    return part
  })

  return {
    background: `conic-gradient(${slices.join(', ')})`,
  }
})
</script>

<template>
  <article class="chart-card">
    <header class="chart-header">
      <div>
        <p class="eyebrow">{{ title }}</p>
        <h2>{{ subtitle }}</h2>
      </div>
    </header>

    <div class="pie-layout">
      <div class="pie-wrap">
        <div class="pie" :style="pieStyle" aria-label="Gráfico circular de distribuição">
          <div class="pie-hole"></div>
        </div>
      </div>

      <ul class="legend" aria-label="Legenda da distribuição de metas">
        <li v-for="segment in segments" :key="segment.label" class="legend-item">
          <span class="swatch" :style="{ background: segment.color }"></span>
          <div>
            <strong>{{ segment.label }}</strong>
            <span>{{ segment.value }}%</span>
          </div>
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.chart-card {
  background: #fff;
  border-radius: 18px;
  padding: 18px 18px 16px;
  border: 1px solid #d9dde7;
  box-shadow: 0 10px 24px rgba(20, 28, 55, 0.05);
}

.chart-header h2,
.chart-header p {
  margin: 0;
}

.eyebrow {
  color: #31499a;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.chart-header h2 {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
  font-weight: 500;
}

.pie-layout {
  display: grid;
  grid-template-columns: minmax(180px, 220px) 1fr;
  gap: 18px;
  align-items: center;
  margin-top: 10px;
}

.pie-wrap {
  display: flex;
  justify-content: center;
}

.pie {
  position: relative;
  width: 220px;
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.55),
    0 10px 20px rgba(17, 24, 39, 0.08);
}

.pie-hole {
  position: absolute;
  inset: 54px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.legend {
  display: grid;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.legend-item {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 10px;
  align-items: start;
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  margin-top: 4px;
}

.legend-item strong,
.legend-item span {
  display: block;
}

.legend-item strong {
  color: #344054;
  font-size: 12px;
}

.legend-item span {
  color: #667085;
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 900px) {
  .pie-layout {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}
</style>
