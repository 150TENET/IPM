<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRecuperacaoStore } from '@/stores/recuperacao'
import euLogo from '@/assets/eu.png'

const rota = useRoute()
const store = useRecuperacaoStore()

const codigoPaisAtual = computed(() =>
  typeof rota.params.country === 'string' ? rota.params.country : null,
)

const paisAtual = computed(() =>
  codigoPaisAtual.value ? store.obterPaisPorCodigo(codigoPaisAtual.value) : null,
)

const emRotaDePais = computed(() => Boolean(codigoPaisAtual.value))

onMounted(() => {
  if (store.paises.length === 0) {
    store.carregarPaises()
  }
})
</script>

<template>
  <nav id="nav">
    <RouterLink to="/" class="eu-logo">
      <img :src="euLogo" alt="Bandeira da União Europeia" class="eu-logo-img" />
      <div class="eu-text">
        <h3>União Europeia</h3>
        <p>Plano de Recuperação e Resiliência</p>
      </div>
    </RouterLink>

    <div class="nav-right">
      <template v-if="rota.name === 'inicio'">
        <RouterLink to="/paises" class="go-country">Ir para Países →</RouterLink>
      </template>

      <template v-else-if="rota.name === 'paises'">
        <RouterLink to="/" class="nav-back">← Voltar a Geral</RouterLink>
      </template>

      <template v-else-if="emRotaDePais">
        <div v-if="paisAtual" class="nav-country-badge">
          <span>
            <img
              :src="paisAtual.flag"
              :alt="`Bandeira de ${paisAtual.name}`"
              class="country-flag-img"
            />
          </span>
          <span>{{ paisAtual.name }}</span>
        </div>
        <RouterLink to="/paises" class="nav-back">← Voltar</RouterLink>
      </template>

      <template v-else-if="rota.name === 'comparacao'">
        <span style="font-size: 13px; color: var(--text-secondary); font-weight: 700"
          >Comparação Regional</span
        >
        <RouterLink to="/paises" class="nav-back" style="margin-left: 12px">← Voltar</RouterLink>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.nav-country-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}

.country-flag-img {
  width: 32px;
  height: 22px;
  object-fit: cover;
  display: block;
}
</style>
