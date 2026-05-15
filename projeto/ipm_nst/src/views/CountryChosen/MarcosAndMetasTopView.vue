<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRecuperacaoStore } from '@/stores/recuperacao'

const route = useRoute()
const store = useRecuperacaoStore()

onMounted(async () => {
  if (store.paises.length === 0) await store.carregarPaises()
  if (route.params.country) await store.carregarDetalhe(route.params.country as string)
})

const pais = computed(() => store.paisDetalhe as any)
</script>

<template>
  <div class="top-wrapper">
    <p class="top-subtitle">
      Objetivos específicos de cada país, detalhados com descrições, prazos e o respetivo estado de execução
    </p>

    <div class="kpi-grid" v-if="pais">
      <div class="kpi-card">
        <div class="kpi-icon kpi-blue">€</div>
        <div>
          <div class="kpi-label">Fundos Totais</div>
          <div class="kpi-value">{{ pais.fundos?.toLocaleString('pt-PT') }} M €</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon kpi-green">📈</div>
        <div>
          <div class="kpi-label">Valor Pago</div>
          <div class="kpi-value">{{ pais.pago?.toLocaleString('pt-PT') }} M €</div>
          <div class="kpi-sub">{{ pais.pagoPct }}% do orçamento total</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon kpi-purple">✓</div>
        <div>
          <div class="kpi-label">Marcos Concluídos</div>
          <div class="kpi-value">{{ pais.marcos }}</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon kpi-orange">🎯</div>
        <div>
          <div class="kpi-label">Metas Atingidas</div>
          <div class="kpi-value">{{ pais.metas }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-wrapper {
  padding: 16px 22px 0;
}

.top-subtitle {
  font-size: 13px;
  color: #888;
  margin: 0 0 16px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 4px;
}

.kpi-card {
  background: white;
  border-radius: 10px;
  padding: 18px 22px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  border: 1px solid #e8eaf0;
}

.kpi-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.kpi-blue { background: #e8eef8; }
.kpi-green { background: #e0f5e8; }
.kpi-purple { background: #f0eaf7; }
.kpi-orange { background: #fff4e5; }

.kpi-label {
  font-size: 11px;
  color: #888;
  margin-bottom: 4px;
}

.kpi-value {
  font-size: 22px;
  font-weight: 800;
  color: #31499a;
}

.kpi-sub {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}
</style>