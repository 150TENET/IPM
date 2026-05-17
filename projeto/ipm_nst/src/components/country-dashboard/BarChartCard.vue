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
  categories: CategoryItem[];
}>()

// --- 2. CÁLCULO DA ESCALA MÁXIMA ---
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

  return max > 100 ? max : 100
})
</script>

<template>
  <div class="bar-chart-card">
    <div class="chart-header">
      <h4>{{ title }}</h4>
      <p class="chart-subtitle">{{ subtitle }}</p>
    </div>

    <div class="chart-scroll-container">
      <div class="chart-body">

        <div
          v-for="item in categories"
          :key="item.label"
          class="chart-column"
        >
          <div class="bars-group">
            <div
              v-for="series in item.series"
              :key="series.name"
              class="bar-wrapper"
            >
              <span class="value-text">
                {{ series.value.toLocaleString() }}{{ valorMaximoDoGrafico > 100 ? 'M' : '%' }}
              </span>

              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{
                    height: `${(series.value / valorMaximoDoGrafico) * 100}%`,
                    backgroundColor: series.color
                  }"
                ></div>
              </div>
            </div>
          </div>

          <div class="category-label">{{ item.label || 'Outro' }}</div>
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
/* --- 3. CORREÇÃO: MOLDURA BRANCA, BORDAS ARREDONDADAS E SOMBRA --- */
.bar-chart-card {
  font-family: sans-serif;
  width: 100%;
  background-color: #ffffff; /* Fundo branco limpo */
  border-radius: 16px;       /* Cantos arredondados iguais aos do gráfico de pizza */
  padding: 24px;             /* Espaçamento interno para afastar o conteúdo das bordas */
  box-shadow: 0 10px 24px rgba(20, 28, 55, 0.05); /* Sombra suave para efeito de elevação */
  box-sizing: border-box;
}

.chart-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #21407a;
  font-weight: 700;
}

.chart-subtitle {
  margin: 4px 0 24px 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.chart-scroll-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 8px;
}

.chart-body {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
  gap: 2rem;
  min-width: 600px;
  padding-top: 1.5rem;
  border-bottom: 2px solid #f1f5f9;
}

.chart-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  height: 100%;
}

.bars-group {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 0.5rem;
  height: 200px;
  margin-bottom: 8px;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.bar-track {
  width: 20px;
  height: 100%;
  background-color: #f1f5f9;
  border-radius: 99px 99px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  border-radius: 99px 99px 0 0;
  transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.value-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 6px;
  text-align: center;
  white-space: nowrap;
}

.category-label {
  text-align: center;
  font-weight: 700;
  color: #475569;
  font-size: 0.8rem;
  margin-top: 12px;
  min-height: 32px;
  max-width: 120px;
  word-wrap: break-word;
}

.chart-legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
}
</style>
