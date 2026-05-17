<script setup lang="ts">
</script>

<template>
  <div class="ind-top-wrapper">
    <p class="pagina-subtitulo">Lista de 14 indicadores de reporte obrigatório e semestral por todos os países</p>
    <div class="alerta-prazo">
      <span class="alerta-icon">⏰</span>
      <div>
        <strong>Próximo Prazo de Submissão</strong>
        <p>Dados do 1º semestre de 2026 devem ser submetidos até <strong>31 de Julho de 2026</strong>. última atualização dos indicadores: <strong>15 de janeiro de 2026</strong>.</p>
      </div>
    </div>
    <div class="resumo-grid">
      <div class="resumo-card"><div class="resumo-valor">14</div><div class="resumo-label">Indicadores Totais</div></div>
      <div class="resumo-card"><div class="resumo-valor azul">Semestral</div><div class="resumo-label">Período de Reporte</div></div>
      <div class="resumo-card"><div class="resumo-valor">27</div><div class="resumo-label">Países de Reporte</div></div>
    </div>
  </div>
</template>

<style scoped>
.ind-top-wrapper { padding: 16px 22px 0; }
.alerta-prazo { display: flex; gap: 12px; align-items: flex-start; background: #fdf8ea; border-left: 4px solid #e0a020; border-radius: 0 10px 10px 0; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; color: #6a5010; }
.alerta-icon { font-size: 18px; margin-top: 2px; }
.alerta-prazo p { margin: 4px 0 0; }
.resumo-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 4px; }
.resumo-card { background: white; border-radius: 10px; padding: 18px 22px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); text-align: center; }
.resumo-valor { font-size: 28px; font-weight: 800; color: #31499a; }
.resumo-valor.azul { color: #2b4fa0; }
.resumo-label { font-size: 12px; color: #888; margin-top: 4px; }
.pagina-subtitulo { font-size: 13px; color: #888; margin: 0 0 16px; }
</style>