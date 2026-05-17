<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useRecuperacaoStore } from '@/stores/recuperacao'

const store = useRecuperacaoStore()

const rootRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const floatingCta = ref<HTMLElement | null>(null)
const ctaStyle = ref<Record<string, string>>({ opacity: '0' })

function positionCta() {
  if (!gridRef.value || !rootRef.value || !floatingCta.value) return

  const containerRect = rootRef.value.getBoundingClientRect()
  const swCard = gridRef.value.querySelector('.country-card[data-code="se"]') as HTMLElement | null

  // If Sweden not found, hide floating CTA (footer fallback shown via CSS)
  if (!swCard) {
    ctaStyle.value = { opacity: '0' }
    return
  }

  const swRect = swCard.getBoundingClientRect()
  const ctaEl = floatingCta.value
  const ctaH = ctaEl.offsetHeight

  const left = swRect.right - containerRect.left + 12
  const top = swRect.top - containerRect.top + (swRect.height - ctaH) / 2

  ctaStyle.value = {
    left: `${Math.round(left)}px`,
    top: `${Math.round(Math.max(8, top))}px`,
    opacity: '1'
  }
}

function handleResize() {
  positionCta()
}

onMounted(async () => {
  if (store.paises.length === 0) {
    store.carregarPaises()
  }

  await nextTick()
  positionCta()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <section>
    <p class="page-subtitle">Selecione um País</p>

    <div v-if="store.aCarregar" class="loading-state">A carregar países...</div>
    <div v-else-if="store.erro" class="error-state">{{ store.erro }}</div>

    <div v-else class="countries-section" ref="rootRef">
      <div class="countries-grid" ref="gridRef">
        <RouterLink
          v-for="pais in store.paises"
          :key="pais.code"
          :to="`/${pais.code}`"
          class="country-card"
          :data-code="pais.code"
        >
          <div class="country-flag">
            <img :src="pais.flag" :alt="`Bandeira de ${pais.name}`" />
          </div>
          <div class="country-name">{{ pais.name }}</div>
        </RouterLink>
      </div>

      <div class="countries-grid">
        <RouterLink to="/comparacao" class="comparison-card">
          <div class="comparison-icon">→</div>
          <div class="comparison-text">
            <div class="comparison-title">Clica aqui</div>
            <div class="comparison-subtitle">Para comparares valores entre países diferentes</div>
          </div>
          <div class="btn-primary btn-small"></div>
        </RouterLink>
      </div>
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

.comparison-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
  grid-column: 1 / -1;
}


.comparison-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comparison-icon {
  font-size: 32px;
  color: #31499a;
  font-weight: bold;
}

.comparison-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comparison-title {
  font-weight: 600;
  color: #31499a;
  font-size: 14px;
}

.comparison-subtitle {
  font-size: 12px;
  color: #9a9a9a;
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

/* Container for absolute positioning */
.countries-section {
  position: relative;
}

.floating-cta {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 30;
  opacity: 0;
  cursor: pointer;
}

.btn-small {
  padding: 8px 12px;
  font-size: 13px;
}

/* On wider screens show the floating CTA and hide the footer */
@media (min-width: 900px) {
  .floating-cta { display: flex; }
  .countries-footer { display: none; }
}

/* On small screens hide floating CTA (fallback to footer) */
@media (max-width: 899px) {
  .floating-cta { display: none !important; }
}
</style>
