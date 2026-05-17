<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRecuperacaoStore } from '@/stores/recuperacao'

const route = useRoute()
const store = useRecuperacaoStore()

onMounted(async () => {
  if (store.paises.length === 0) await store.carregarPaises()
  if (route.params.country) {
    await store.carregarDetalhe(route.params.country as string)
    await store.carregarPagamentos(route.params.country as string)
    await store.carregarBeneficiarios(route.params.country as string)
  }
})

const pais = computed(() => store.paisDetalhe as any)
</script>

<template>
  <div class="pag-top">
    <p class="subtitulo">Detalhe dos pagamentos efetuados pela UE a cada país, discriminando datas, montantes e tipologias</p>
    <div class="cards" v-if="pais">
      <div class="card blue">
        <div class="card-icon">€</div>
        <div class="card-label">Total Desembolsado</div>
        <div class="card-value">{{ pais.desembolsado }}</div>
      </div>
      <div class="card green">
        <div class="card-icon">📅</div>
        <div class="card-label">Total de Pagamentos</div>
        <div class="card-value">{{ pais.pagamentos }}</div>
      </div>
      <div class="card purple">
        <div class="card-icon">👤</div>
        <div class="card-label">Beneficiários Únicos</div>
        <div class="card-value">{{ pais.beneficiarios?.toLocaleString('pt-PT') }}</div>
      </div>
      <div class="card orange">
        <div class="card-icon">€</div>
        <div class="card-label">Média por Pagamento</div>
        <div class="card-value">{{ pais.mediaPagamento }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pag-top { padding: 16px 22px 0; }
.subtitulo { font-size: 13px; color: #888; margin: 0 0 16px; }
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.card { border-radius: 12px; padding: 20px; color: white; }
.blue { background: #2f6fed; }
.green { background: #1db954; }
.purple { background: #a142f4; }
.orange { background: #ff6a00; }
.card-icon { font-size: 20px; margin-bottom: 8px; }
.card-label { font-size: 12px; opacity: 0.85; margin-bottom: 6px; }
.card-value { font-size: 18px; font-weight: 800; }
</style>