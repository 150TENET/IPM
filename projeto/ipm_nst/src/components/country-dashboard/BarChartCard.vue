<script setup lang="ts">
import { computed } from 'vue'
import type { BarCategory } from '@/views/CountryChosen/marcosAndMetas.data'

const props = defineProps<{
  title: string
  subtitle: string
  categories: BarCategory[]
}>()

const seriesNames = computed(() => props.categories[0]?.series.map((serie) => serie.name) ?? [])

const maxValue = computed(() => {
  const values = props.categories.flatMap((category) => category.series.map((serie) => serie.value))
  return Math.max(100, ...values)
})

function barHeight(value: number) {
  return `${(value / maxValue.value) * 100}%`
}
</script>

<template>
  <article class="chart-card">
    <header class="chart-header">
      <div>
        <p class="eyebrow">{{ title }}</p>
        <h2>{{ subtitle }}</h2>
      </div>
    </header>

    <div class="plot-shell">
      <div class="y-axis" aria-hidden="true">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
        <span>0</span>
      </div>

      <div class="plot-area">
        <div class="grid-lines" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div
          class="bars-row"
          :style="{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }"
        >
          <div v-for="category in categories" :key="category.label" class="bars-group">
            <div class="bars">
              <div
                v-for="serie in category.series"
                :key="`${category.label}-${serie.name}`"
                class="bar-wrapper"
              >
                <div
                  class="bar"
                  :style="{ height: barHeight(serie.value), background: serie.color }"
                >
                  <span class="bar-value">{{ serie.value }}%</span>
                </div>
              </div>
            </div>
            <p class="category-label">{{ category.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <footer class="legend" aria-label="Legenda dos gráficos">
      <span v-for="name in seriesNames" :key="name" class="legend-item">
        <i :data-series="name"></i>
        {{ name }}
      </span>
    </footer>
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

.plot-shell {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  margin-top: 12px;
}

.y-axis {
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  color: #98a2b3;
  font-size: 10px;
  font-weight: 700;
  text-align: right;
  padding: 2px 0 28px;
}

.plot-area {
  position: relative;
  min-height: 250px;
  padding: 8px 8px 0 0;
}

.grid-lines {
  position: absolute;
  inset: 0 0 42px;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
}

.grid-lines span {
  border-top: 1px solid #edf1f7;
}

.bars-row {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 16px;
  align-items: end;
  min-height: 250px;
}

.bars-group {
  display: grid;
  align-content: end;
  gap: 10px;
}

.bars {
  height: 220px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: end;
  gap: 8px;
  padding: 0 8px;
}

.bar-wrapper {
  display: flex;
  align-items: end;
  height: 100%;
}

.bar {
  width: 100%;
  min-height: 10px;
  border-radius: 12px 12px 6px 6px;
  position: relative;
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.24);
}

.bar-value {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 800;
  color: #6b7280;
  white-space: nowrap;
}

.category-label {
  margin: 0;
  color: #344054;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 14px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667085;
  font-size: 11px;
  font-weight: 700;
}

.legend-item i {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #c7cad9;
}

.legend-item i[data-series='Em curso'] {
  background: #5d6ee6;
}

.legend-item i[data-series='Concluído'] {
  background: #1db954;
}

@media (max-width: 900px) {
  .bars-row {
    gap: 10px;
  }

  .bars {
    gap: 5px;
    padding: 0 4px;
  }
}
</style>
