<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
</script>

<template>
  <div id="app">
    <AppNav />
    <main id="main">
      <RouterView />
    </main>
    <footer id="footer">
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
