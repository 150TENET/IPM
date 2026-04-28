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
        :to="`/${pais.code}`"
        class="country-card"
      >
        <div class="country-flag">
          <img :src="pais.flag" :alt="`Bandeira de ${pais.name}`" />
        </div>
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

<style scoped>
.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding: 24px 0;
}

.country-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.country-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.country-flag {
  width: 120px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
}

.country-flag img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.country-name {
  font-weight: 600;
  color: #31499a;
  text-align: center;
  font-size: 14px;
}

.countries-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
  border-top: 1px solid #bfbfbf;
  margin-top: 40px;
}

.footer-hint {
  cursor: pointer;
  color: #31499a;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-hint span {
  font-size: 12px;
  color: #9a9a9a;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px 20px;
  color: #31499a;
  font-size: 16px;
}

.error-state {
  color: #d32f2f;
}
</style>
