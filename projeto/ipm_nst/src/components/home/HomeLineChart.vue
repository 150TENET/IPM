<script setup lang="ts">
import { computed } from 'vue'

export type HomeLineSeries = {
  label: string
  color: string
  values: number[]
}

const props = defineProps<{
  categories: string[]
  series: HomeLineSeries[]
  maxValue?: number
  yTicks?: number[]
}>()

const width = 800
const height = 340
const paddingLeft = 60
const paddingRight = 40
const paddingTop = 20
const paddingBottom = 60

const chartWidth = width - paddingLeft - paddingRight
const chartHeight = height - paddingTop - paddingBottom

const maxValue = computed(() => props.maxValue ?? 3000)
const yTicks = computed(() => props.yTicks ?? [0, 500, 1000, 1500, 2000, 2500, 3000])

function xPos(index: number) {
  return paddingLeft + (index / (props.categories.length - 1)) * chartWidth
}

function yPos(value: number) {
  return paddingTop + chartHeight - (value / maxValue.value) * chartHeight
}

function areaPath(values: number[]) {
  const points = values.map((value, index) => `${xPos(index)},${yPos(value)}`).join(' L ')
  const bottom = values.map((_, index) => `${xPos(index)},${yPos(0)}`).reverse().join(' L ')
  return `M ${points.split(' L ')[0]} L ${points.split(' L ').slice(1).join(' L ')} L ${bottom} Z`
}

function linePath(values: number[]) {
  return values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${xPos(index)} ${yPos(value)}`).join(' ')
}
</script>

<template>
  <svg class="line-chart" :viewBox="`0 0 ${width} ${height}`" aria-label="Gráfico temporal de pagamentos">
    <defs>
      <linearGradient
        v-for="serie in series"
        :key="serie.label"
        :id="`grad-${serie.label.replace(/\s+/g, '')}`"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop offset="0%" :stop-color="serie.color" stop-opacity="0.35" />
        <stop offset="100%" :stop-color="serie.color" stop-opacity="0.02" />
      </linearGradient>
    </defs>

    <line
      v-for="tick in yTicks"
      :key="`grid-${tick}`"
      :x1="paddingLeft"
      :y1="yPos(tick)"
      :x2="paddingLeft + chartWidth"
      :y2="yPos(tick)"
      stroke="#ccc"
      stroke-width="0.5"
      stroke-dasharray="3,3"
    />

    <text
      v-for="tick in yTicks"
      :key="`label-${tick}`"
      :x="paddingLeft - 8"
      :y="yPos(tick)"
      text-anchor="end"
      dominant-baseline="middle"
      class="line-chart__axis-label"
    >
      {{ tick }}
    </text>

    <text
      :x="12"
      :y="paddingTop + chartHeight / 2"
      text-anchor="middle"
      :transform="`rotate(-90, 12, ${paddingTop + chartHeight / 2})`"
      class="line-chart__axis-title"
    >
      € Milhões
    </text>

    <path
      v-for="serie in series"
      :key="`${serie.label}-area`"
      :d="areaPath(serie.values)"
      :fill="`url(#grad-${serie.label.replace(/\s+/g, '')})`"
    />

    <path
      v-for="serie in series"
      :key="`${serie.label}-line`"
      :d="linePath(serie.values)"
      fill="none"
      :stroke="serie.color"
      stroke-width="2"
    />

    <template v-for="serie in series" :key="serie.label">
      <circle
        v-for="(value, index) in serie.values"
        :key="`${serie.label}-${index}`"
        :cx="xPos(index)"
        :cy="yPos(value)"
        r="4"
        fill="white"
        :stroke="serie.color"
        stroke-width="2"
      />
    </template>

    <text
      v-for="(category, index) in categories"
      :key="category"
      :x="xPos(index)"
      :y="height - paddingBottom + 18"
      text-anchor="middle"
      class="line-chart__category"
    >
      {{ category }}
    </text>

    <g v-for="(serie, index) in series" :key="`${serie.label}-legend`">
      <circle
        :cx="width / 2 - 120 + index * 100"
        :cy="height - 12"
        r="4"
        fill="none"
        :stroke="serie.color"
        stroke-width="1.5"
        stroke-dasharray="2,2"
      />
      <text
        :x="width / 2 - 112 + index * 100"
        :y="height - 12"
        dominant-baseline="middle"
        class="line-chart__legend"
      >
        {{ serie.label }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.line-chart {
  width: 100%;
}

.line-chart__axis-label,
.line-chart__axis-title,
.line-chart__category,
.line-chart__legend {
  font-family: inherit;
}

.line-chart__axis-label {
  font-size: 10px;
  fill: #666;
}

.line-chart__axis-title {
  font-size: 10px;
  fill: #888;
}

.line-chart__category {
  font-size: 11px;
  fill: #444;
}

.line-chart__legend {
  font-size: 10px;
  fill: #555;
}
</style>
