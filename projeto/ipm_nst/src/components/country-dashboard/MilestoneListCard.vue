<script setup lang="ts">
import type { MilestoneItem } from '@/views/CountryChosen/marcosAndMetas.data'

defineProps<{
  title: string
  subtitle: string
  items: MilestoneItem[]
}>()

function statusClass(status: MilestoneItem['status']) {
  return {
    'is-done': status === 'Concluído',
    'is-progress': status === 'Em progresso',
    'is-pending': status === 'Pendente',
  }
}
</script>

<template>
  <article class="list-card">
    <header class="list-header">
      <div>
        <p class="eyebrow">{{ title }}</p>
        <h2>{{ subtitle }}</h2>
      </div>
    </header>

    <div class="items">
      <section v-for="item in items" :key="`${item.title}-${item.date}`" class="item">
        <div class="item-top">
          <div class="item-copy">
            <h3>{{ item.title }}</h3>
            <p>{{ item.category }} · {{ item.date }}</p>
          </div>

          <span class="status-pill" :class="statusClass(item.status)">
            {{ item.status }}
          </span>
        </div>

        <div class="item-bottom">
          <span class="category-pill">{{ item.category }}</span>

          <div class="progress">
            <div class="progress-track">
              <span class="progress-fill" :style="{ width: `${item.progress}%` }"></span>
            </div>
            <span class="progress-label">{{ item.progress }}%</span>
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.list-card {
  background: #fff;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid #d9dde7;
  box-shadow: 0 10px 24px rgba(20, 28, 55, 0.05);
}

.list-header h2,
.list-header p {
  margin: 0;
}

.eyebrow {
  color: #31499a;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.list-header h2 {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
  font-weight: 500;
}

.items {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.item {
  padding: 14px 0;
  border-top: 1px solid #edf1f7;
}

.item:first-child {
  border-top: 0;
  padding-top: 0;
}

.item-top,
.item-bottom {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.item-copy h3 {
  margin: 0;
  color: #101828;
  font-size: 14px;
  font-weight: 800;
}

.item-copy p {
  margin: 6px 0 0;
  color: #667085;
  font-size: 11px;
  font-weight: 600;
}

.status-pill,
.category-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.status-pill {
  align-self: flex-start;
}

.category-pill {
  color: #334155;
  background: #eff2f7;
}

.status-pill.is-done {
  color: #0e7a40;
  background: #e8f8ef;
}

.status-pill.is-progress {
  color: #3559d4;
  background: #e9efff;
}

.status-pill.is-pending {
  color: #b76b00;
  background: #fff3db;
}

.item-bottom {
  align-items: center;
  margin-top: 10px;
}

.progress {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 210px;
}

.progress-track {
  position: relative;
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: #edf1f7;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #5d6ee6 0%, #31c48d 100%);
}

.progress-label {
  min-width: 38px;
  color: #667085;
  font-size: 11px;
  font-weight: 800;
  text-align: right;
}

@media (max-width: 720px) {
  .item-top,
  .item-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .progress {
    width: 100%;
    min-width: 0;
  }
}
</style>
