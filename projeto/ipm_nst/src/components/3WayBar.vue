<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

type TabRoute = 'marcosandmetas' | 'indicadores' | 'pagamentos'

const rota = useRoute()

const codigoPais = computed(() =>
  typeof rota.params.country === 'string' ? rota.params.country : ''
)

const separadores = [
  { label: 'Marcos e Metas', route: 'marcosandmetas' as TabRoute },
  { label: 'Indicadores', route: 'indicadores' as TabRoute },
  { label: 'Desembolsos', route: 'pagamentos' as TabRoute },
]
</script>

<template>
  <nav class="bar" aria-label="Navegação do país">
    <RouterLink
      v-for="separador in separadores"
      :key="separador.route"
      :to="{ name: separador.route, params: { country: codigoPais } }"
      class="bar-link"
      :class="{ 'is-active': rota.name === separador.route }"
    >
      {{ separador.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.bar {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2px;
  width: min(100%, 760px);
  margin: 24px auto 0;
  padding: 3px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #c5cad6;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}

.bar-link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 14px;
  border-radius: 999px;
  color: #31499a;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  transition: background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}

.bar-link:hover {
  background: rgba(49, 73, 154, 0.08);
}

.bar-link.is-active {
  background: #eef2ff;
  color: #20306b;
  box-shadow: inset 0 0 0 1px rgba(49, 73, 154, 0.16);
}
</style>
