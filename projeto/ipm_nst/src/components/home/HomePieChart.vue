<script setup lang="ts">
import { computed } from 'vue'

export type HomePieData = {
  value: number
  display: string
  color: string
  label: string
}

const props = defineProps<{
  data: HomePieData[]
}>()

const size = 300
const cx = size / 2
const cy = size / 2
const radius = 110

const slices = computed(() => {
  const total = props.data.reduce((sum, item) => sum + item.value, 0)
  let cumulativeAngle = -Math.PI / 2

  return props.data.map((item) => {
    const angle = (item.value / total) * 2 * Math.PI
    const startAngle = cumulativeAngle
    const endAngle = cumulativeAngle + angle
    cumulativeAngle = endAngle

    const x1 = cx + radius * Math.cos(startAngle)
    const y1 = cy + radius * Math.sin(startAngle)
    const x2 = cx + radius * Math.cos(endAngle)
    const y2 = cy + radius * Math.sin(endAngle)
    const largeArc = angle > Math.PI ? 1 : 0

    const midAngle = startAngle + angle / 2
    const labelX = cx + (radius + 28) * Math.cos(midAngle)
    const labelY = cy + (radius + 28) * Math.sin(midAngle)

    return {
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: item.color,
      label: item.label,
      value: item.display,
      labelX,
      labelY,
    }
  })
})
</script>

<template>
  <svg class="pie-chart" viewBox="0 0 300 300" aria-label="Gráfico circular de fundos do PRR">
    <g v-for="layer in [6, 5, 4, 3, 2, 1]" :key="layer" :style="`transform: translateY(${layer * 2}px)`">
      <path
        v-for="slice in slices"
        :key="`${slice.label}-${layer}`"
        :d="slice.path"
        :fill="slice.color"
        opacity="0.25"
        style="filter: brightness(0.7)"
      />
    </g>

    <path
      v-for="slice in slices"
      :key="`${slice.label}-main`"
      :d="slice.path"
      :fill="slice.color"
      stroke="#f0f0f0"
      stroke-width="1.5"
    />

    <text
      v-for="slice in slices"
      :key="`${slice.label}-label`"
      :x="slice.labelX"
      :y="slice.labelY"
      text-anchor="middle"
      dominant-baseline="middle"
      class="pie-chart__label"
    >
      {{ slice.value }}
    </text>
  </svg>
</template>

<style scoped>
.pie-chart {
  width: 100%;
  max-width: 300px;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15));
}

.pie-chart__label {
  font-size: 9px;
  fill: #1a2a5e;
  font-weight: 700;
  font-family: inherit;
}
</style>
