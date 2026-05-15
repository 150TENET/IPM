<script setup lang="ts">
import { computed } from 'vue'
import type { BarCategory } from '@/views/CountryChosen/marcosAndMetas.data'

const props = defineProps<{
  title: string
  subtitle: string
  categories: BarCategory[]
  horizontal?: boolean
}>()

const seriesNames = computed(() => props.categories[0]?.series.map((serie) => serie.name) ?? [])

const maxValue = computed(() => {
  const values = props.categories.flatMap((category) => category.series.map((serie) => serie.value))
  return Math.max(100, ...values)
})

const ticksCount = 6

const displayMax = computed(() => {
  const v = maxValue.value
  const baseStep = Math.ceil(v / ticksCount)
  const pow = Math.pow(10, Math.max(0, Math.floor(Math.log10(baseStep))))
  const step = Math.ceil(baseStep / pow) * pow
  return step * ticksCount
})

const tickStep = computed(() => Math.round(displayMax.value / ticksCount))

const ticks = computed(() => {
  const arr = []
  for (let i = 0; i <= ticksCount; i++) arr.push(i * tickStep.value)
  return arr
})

function colorForSeries(name: string) {
  // find first matching series color
  for (const cat of props.categories) {
    const s = cat.series.find((x) => x.name === name)
    if (s && s.color) return s.color
  }
  // fallback palette
  return name && name.toLowerCase().includes('austria') ? '#7FC8A9' : '#FFD54F'
}

function barHeight(value: number) {
  return `${(value / maxValue.value) * 100}%`
}

function barWidth(value: number) {
  return `${(value / displayMax.value) * 100}%`
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

    <div class="plot-shell" :class="{ horizontal: props.horizontal }">
      <div v-if="!props.horizontal" class="y-axis" aria-hidden="true">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
        <span>0</span>
      </div>

      <div :class="['plot-area', { 'horizontal-grid': props.horizontal }]">
        <div v-if="!props.horizontal" class="grid-lines" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div v-if="!props.horizontal"
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

        <!-- HORIZONTAL LAYOUT -->
        <div v-if="props.horizontal" class="h-rows-wrapper">
          <div class="h-top-axis" aria-hidden="true" :style="{ gridTemplateColumns: `200px repeat(${ticks.length - 1}, 1fr)` }">
            <div></div>
            <div v-for="(t,i) in ticks" :key="i" class="h-tick">{{ t }}</div>
          </div>
          <div class="h-unit">Milhões€</div>

          <div class="h-rows">
            <div v-for="category in categories" :key="category.label" class="h-row">
              <div class="h-label">{{ category.label }}</div>
              <div class="h-bars">
                <div v-for="(serie, idx) in category.series" :key="`${category.label}-${serie.name}-h`" class="h-bar-wrap">
                  <div class="h-bar" :style="{ width: barWidth(serie.value), background: serie.color ?? colorForSeries(serie.name) }">
                    <span class="h-bar-value">{{ serie.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="legend" aria-label="Legenda dos gráficos">
      <span v-for="name in seriesNames" :key="name" class="legend-item">
        <i :style="{ background: colorForSeries(name) }"></i>
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

/* Horizontal layout styles */
.plot-shell.horizontal { grid-template-columns: 220px 1fr; }
.h-rows { display:flex; flex-direction:column; gap:18px }
.h-row { display:flex; align-items:center; gap:18px }
.h-label { width:200px; color:#6b7280; font-weight:700 }
.h-bars { flex:1; position:relative }
.h-bar-wrap { margin-bottom:8px }
.h-bar { height:28px; border-radius:6px; position:relative }
.h-bar-value { position:absolute; right: -36px; top: 50%; transform: translateY(-50%); color:#6b7280; font-weight:700; }

.h-bar::after { content: ''; position:absolute; inset:0; box-shadow: inset 0 -1px 0 rgba(255,255,255,0.24); border-radius:6px }

/* horizontal top axis */
.h-top-axis { display:grid; grid-template-columns: 200px repeat(5, 1fr); gap:0; align-items:center; margin-bottom:6px; color:#8b97a6; font-weight:700 }
.h-top-axis .h-tick { text-align:right; padding-right:12px; font-size:13px }
.h-unit { text-align:right; color:#8b97a6; font-weight:700; margin-bottom:6px }

/* vertical dotted grid for horizontal layout */
.plot-area.horizontal-grid { background-image: linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 120px 100%; }

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
