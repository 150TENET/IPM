<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRecuperacaoStore } from '@/stores/recuperacao'
import euLogo from '@/assets/eu.png'

const rota = useRoute()
const store = useRecuperacaoStore()

const paisAtual = computed(() =>
  rota.params.codigo ? store.obterPaisPorCodigo(rota.params.codigo as string) : null
)
</script>

<template>
  <nav id="nav">
    <RouterLink to="/" class="eu-logo">
      <img :src="euLogo" alt="Bandeira da União Europeia" class="eu-logo-img">
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

      <template v-else-if="rota.name === 'detalhe-pais'">
        <div v-if="paisAtual" class="nav-country-badge">
          <span>{{ paisAtual.flag }}</span>
          <span>{{ paisAtual.name }}</span>
        </div>
        <RouterLink to="/paises" class="nav-back">← Voltar</RouterLink>
      </template>

      <template v-else-if="rota.name === 'comparacao'">
        <span style="font-size:13px;color:var(--text-secondary);font-weight:700;">Comparação Regional</span>
        <RouterLink to="/paises" class="nav-back" style="margin-left:12px;">← Voltar</RouterLink>
      </template>
    </div>
  </nav>
</template>