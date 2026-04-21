<template>
  <div class="layout-dashboard">
    <nav class="tabs-nav">
      <router-link :to="`/${$route.params.country}/marcosandmetas`" class="tab-link">
        Marcos e Metas
      </router-link>
      <router-link :to="`/${$route.params.country}/indicadores`" class="tab-link">
        Indicadores
      </router-link>
      <router-link :to="`/${$route.params.country}/pagamentos`" class="tab-link">
        Pagamentos
      </router-link>
    </nav>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>
