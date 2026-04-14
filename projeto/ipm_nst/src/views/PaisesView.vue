<script setup lang="ts">
import { onMounted } from 'vue'
import { useRecuperacaoStore } from '@/stores/recuperacao'

const store = useRecuperacaoStore()

onMounted(() => {
  if (store.paises.length === 0) {
    store.carregarPaises()
  }
})
</script>

<template>
  <section>
    <p class="page-subtitle">Selecione um País</p>

    <div v-if="store.aCarregar" class="loading-state">A carregar países...</div>
    <div v-else-if="store.erro" class="error-state">{{ store.erro }}</div>

    <div v-else class="countries-grid">
      <RouterLink
        v-for="pais in store.paises"
        :key="pais.code"
        :to="`/paises/${pais.code}`"
        class="country-card"
      >
        <div class="country-flag">{{ pais.flag }}</div>
        <div class="country-name">{{ pais.name }}</div>
      </RouterLink>
    </div>

    <div class="countries-footer">
      <div class="footer-hint" @click="$router.push('/comparacao')">
        Clica aqui →
        <span>Para comparares valores entre países diferentes</span>
      </div>
      <RouterLink to="/comparacao" class="btn-primary">Comparação Regional</RouterLink>
    </div>
  </section>
</template>