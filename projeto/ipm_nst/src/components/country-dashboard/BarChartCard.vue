<script setup lang="ts">
import { computed } from 'vue'

// --- 1. CONTRATO DE PROPRIEDADES DO COMPONENTE MODULAR ---
interface SeriesItem {
  name: string;
  value: number;
  color: string;
}

interface CategoryItem {
  label: string;
  series: SeriesItem[];
}

const props = defineProps<{
  title: string;
  subtitle: string;
  horizontal?: boolean;
  categories: CategoryItem[];
}>()

// --- 2. HEURÍSTICA DE INTERFACE: Cálculo automático da escala (Fim do Layout Quebrado) ---
// Percorre todas as categorias e séries recebidas para encontrar o maior valor real (ex: 739.84)
const valorMaximoDoGrafico = computed(() => {
  let max = 0
  if (!props.categories || props.categories.length === 0) return 100

  props.categories.forEach(cat => {
    if (cat.series && Array.isArray(cat.series)) {
      cat.series.forEach(s => {
        if (s.value > max) max = s.value
      })
    }
  })

  // Se o maior valor for menor ou igual a 100, assume escala percentual padrão (0-100)
  // Se for maior (como 739.84M €), adapta a escala dinamicamente para esse topo
  return max > 100 ? max : 100
})
</script>

<template>
  <div class="bar-chart-card">
    <div class="chart-header">
      <h4>{{ title }}</h4>
      <p class="chart-subtitle">{{ subtitle }}</p>
    </div>

    <div :class="['chart-body', { 'is-horizontal': horizontal }]">
      <div
        v-for="item in categories"
        :key="item.label"
        class="chart-row"
      >
        <div class="category-label">{{ item.label || 'Outro' }}</div>

        <div class="bars-group">
          <div
            v-for="series in item.series"
            :key="series.name"
            class="bar-wrapper"
          >
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{
                  // Divide o valor do projeto pelo máximo calculado para nunca estoirar o flexbox (HCI)
                  width: `${(series.value / valorMaximoDoGrafico) * 100}%`,
                  backgroundColor: series.color
                }"
              ></div>
            </div>

            <span class="value-text">
              {{ series.value.toLocaleString() }}{{ valorMaximoDoGrafico > 100 ? 'M €' : '%' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-legend" v-if="categories[0]?.series">
      <div
        v-for="series in categories[0].series"
        :key="series.name"
        class="legend-item"
      >
        <span class="legend-dot" :style="{ backgroundColor: series.color }"></span>
        <span class="legend-name">{{ series.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar-chart-card {
  font-family: sans-serif;
  width: 100%;
}

.chart-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #21407a;
  font-weight: 700;
}

.chart-subtitle {
  margin: 4px 0 20px 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.chart-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.category-label {
  width: 180px;
  font-weight: 700;
  color: #334155;
  font-size: 0.9rem;
  word-wrap: break-word;
}

.bars-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.bar-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.bar-track {
  flex: 1;
  background-color: #f1f5f9;
  height: 12px;
  border-radius: 99px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.value-text {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  min-width: 75px;
  text-align: left;
}

.chart-legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
}

@media (max-width: 768px) {
  .chart-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .category-label {
    width: 100%;
  }
}
</style>
