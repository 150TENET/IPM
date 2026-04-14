<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNav from '@/components/AppNav.vue'

const rota = useRoute()
const eEntrar = computed(() => rota.name === 'entrar')
</script>

<template>
  <div id="app" :class="{ 'layout-entrar': eEntrar }">
    <AppNav v-if="!eEntrar" />
    <main id="main">
      <RouterView />
    </main>
    <footer v-if="!eEntrar" id="footer">
      Plano de Recuperação e Resiliência · União Europeia
    </footer>
  </div>
</template>

<style>
.layout-entrar {
  display: block !important;
  background: #d4d4d4 !important;
  border: none !important;
}

.layout-entrar #main {
  padding: 0 !important;
}
</style>