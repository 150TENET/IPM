<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <p>Bom dia Nenny!</p>
  <RouterLink to="/indicadores">Indicadores</RouterLink>
  <RouterView />
</template>

<style scoped></style>
