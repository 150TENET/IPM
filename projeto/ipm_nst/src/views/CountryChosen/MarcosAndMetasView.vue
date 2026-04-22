<script setup lang="ts">
import BarChartCard from '@/components/country-dashboard/BarChartCard.vue'
import PieChartCard from '@/components/country-dashboard/PieChartCard.vue'
import MilestoneListCard from '@/components/country-dashboard/MilestoneListCard.vue'
import { barCategories, pieSegments, milestoneItems } from './marcosAndMetas.data'
</script>

<template>
  <section class="marcos-page">
    <header class="page-hero">
      <div>
        <p class="kicker">Marcos e Metas</p>
        <h1>Execução por categoria</h1>
        <p class="description">
          Visão modular dos principais marcos do PRR, com distribuição por área e os itens mais
          recentes.
        </p>
      </div>

      <div class="hero-chip">
        <span></span>
        Atualizado em 22 abr 2026
      </div>
    </header>

    <div class="charts-grid">
      <BarChartCard
        title="Progresso de Marcos por Categoria"
        subtitle="Comparação entre planeado, em curso e concluído"
        :categories="barCategories"
      />

      <PieChartCard
        title="Distribuição de Metas"
        subtitle="Percentagem de metas por área temática"
        :segments="pieSegments"
      />
    </div>

    <MilestoneListCard
      title="Lista de Marcos Recentes"
      subtitle="Implementações e metas acompanhadas recentemente"
      :items="milestoneItems"
    />
  </section>
</template>

<style scoped>
.marcos-page {
  display: grid;
  gap: 18px;
  padding: 22px;
}

.page-hero {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
}

.kicker {
  margin: 0;
  color: #31499a;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.page-hero h1 {
  margin: 6px 0 0;
  color: #101828;
  font-size: 26px;
  font-weight: 800;
}

.description {
  max-width: 720px;
  margin: 8px 0 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.55;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: #fff;
  color: #475467;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 10px 24px rgba(20, 28, 55, 0.05);
}

.hero-chip span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #31c48d;
}

.charts-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.95fr);
  gap: 18px;
}

@media (max-width: 1100px) {
  .charts-grid,
  .page-hero {
    grid-template-columns: 1fr;
  }

  .page-hero {
    display: grid;
    align-items: start;
  }
}

@media (max-width: 720px) {
  .marcos-page {
    padding: 16px;
  }

  .page-hero h1 {
    font-size: 22px;
  }
}
</style>
