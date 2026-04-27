<template>
  <div class="inicio">

    <!-- HERO SECTION-->
    <section class="hero">
      <div class="hero__left">
        <h1 class="hero__title">
          Plano de<br />Recuperação<br />e Resiliência
        </h1>
        <p class="hero__subtitle">
          Visualiza como os fundos estão a ser investidos, gastos
          e impactam a recuperação económica da Europa.
        </p>

        <div class="hero__tags">
          <span class="tag tag--green">Clima - 37%</span>
          <span class="tag tag--purple">Digital - 20%</span>
          <span class="tag tag--beige">Educação - 15%</span>
          <span class="tag tag--teal">Saúde - 10%</span>
          <span class="tag tag--salmon">Infraestruturas - 18%</span>
          <span class="tag tag--white">27 Estados-Membro</span>
        </div>
      </div>

      <div class="hero__right">
        <div class="chart-wrapper">
          <PieChart :data="pieData" />
        </div>

        <div class="execucao-card">
          <span class="execucao-label">% de Execução - 34.7%</span>
        </div>
      </div>
    </section>

    <!-- o que é o PRR -->
    <section class="prr-info">
      <div class="prr-info__card">
        <h2 class="prr-info__title">
          O que é o Plano de Recuperação e Recuperação e Resiliência(PRR)?
        </h2>
        <p class="prr-info__desc">
          O PRR é um programa de aplicação nacional, que visa implementar um conjunto de reformas e investimentos destinados
          a repor o crescimento económico sustentado após a pandemia. Financiado pela União Europeia através do mecanismo
          NextGenerationEU, o plano foca-se em preparar o país para os desafios do futuro, com especial ênfase na transição
          climática e na transformação digital.
        </p>

        <div class="prr-info__grid">
          <div class="prr-info__col">
            <h3><span class="icon">↗</span> Objetivos Principais</h3>
            <ul>
              <li><strong>Mitigação de Impacto:</strong> Neutralizar os efeitos económicos e sociais negativos causados pela crise pandémica.</li>
              <li><strong>Sustentabilidade Futura:</strong> Reformar as economias para que sejam mais resilientes, inclusivas e preparadas para crises futuras.</li>
              <li><strong>A Dupla Transição:</strong> Acelerar em simultâneo a neutralidade carbónica e a modernização tecnológica.</li>
              <li><strong>Coesão Territorial:</strong> Reduzir as desigualdades entre regiões e promover o emprego de qualidade.</li>
            </ul>
          </div>

          <div class="prr-info__col">
            <h3><span class="icon">✓</span> Compromissos Mínimos</h3>
            <ul>
              <li><strong>Meta Verde (37%):</strong> Pelo menos 37% de cada plano nacional deve ser investido em objetivos climáticos e biodiversidade.</li>
              <li><strong>Meta Digital (20%):</strong> Um mínimo de 20% do orçamento deve ser dedicado à digitalização de empresas e serviços públicos.</li>
              <li><strong>Reformas Estruturais:</strong> O dinheiro só é libertado se o país implementar reformas reais nas suas instituições e leis.</li>
              <li><strong>Não Prejudicar (DNSH):</strong> Garantia de que nenhum investimento causa danos significativos ao meio ambiente (Do No Significant Harm).</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- EVOLUÇÃO TEMPORAL-->
    <section class="evolucao">
      <h2 class="evolucao__title">
        Evolução Temporal - Total de pagamentos feitos em cada área até ao início<br />do ano indicado
      </h2>
      <div class="evolucao__chart">
        <LineChart :data="lineData" />
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed, h, defineComponent } from 'vue'

// ─── PIE CHART ────────────────────────────────────────────
const PieChart = defineComponent({
  name: 'PieChart',
  props: { data: Array },
  setup(props) {
    return () => {
      const size = 300
      const cx = size / 2
      const cy = size / 2
      const r = 110
      const innerR = 0

      const total = (props.data as any[]).reduce((s: number, d: any) => s + d.value, 0)
      let cumAngle = -Math.PI / 2

      const slices = (props.data as any[]).map((d: any) => {
        const angle = (d.value / total) * 2 * Math.PI
        const startAngle = cumAngle
        const endAngle = cumAngle + angle
        cumAngle = endAngle

        const x1 = cx + r * Math.cos(startAngle)
        const y1 = cy + r * Math.sin(startAngle)
        const x2 = cx + r * Math.cos(endAngle)
        const y2 = cy + r * Math.sin(endAngle)
        const largeArc = angle > Math.PI ? 1 : 0

        const midAngle = startAngle + angle / 2
        const lx = cx + (r + 28) * Math.cos(midAngle)
        const ly = cy + (r + 28) * Math.sin(midAngle)

        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`

        return { path, color: d.color, label: d.label, value: d.display, lx, ly, midAngle }
      })

      return h('svg', {
        viewBox: `0 0 ${size} ${size}`,
        style: 'width:100%;max-width:300px;filter:drop-shadow(0 8px 24px rgba(0,0,0,0.15))'
      }, [
        // 3D effect layers
        ...[6, 5, 4, 3, 2, 1].map(i =>
          h('g', { style: `transform: translateY(${i * 2}px)` },
            slices.map(s =>
              h('path', {
                d: s.path,
                fill: s.color,
                opacity: 0.25,
                style: 'filter: brightness(0.7)'
              })
            )
          )
        ),
        // Main slices
        ...slices.map(s =>
          h('path', { d: s.path, fill: s.color, stroke: '#f0f0f0', 'stroke-width': '1.5' })
        ),
        // Labels
        ...slices.filter(s => s.value).map(s =>
          h('text', {
            x: s.lx,
            y: s.ly,
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
            style: 'font-size:9px;font-family:inherit;fill:#1a2a5e;font-weight:600'
          }, s.value)
        )
      ])
    }
  }
})

const pieData = computed(() => [
  { value: 723.8, display: '€723.8 mil milhões', color: '#8b8fd8', label: 'Total Disponível' },
  { value: 648,   display: '€648 mil milhões',   color: '#f4857a', label: 'Total Comprometido' },
  { value: 225,   display: '€225 mil milhões',   color: '#5dd9d0', label: 'Total Desembolsado' },
])

// ─── LINE CHART ───────────────────────────────────────────
const LineChart = defineComponent({
  name: 'LineChart',
  props: { data: Object },
  setup(props) {
    return () => {
      const W = 800, H = 340
      const padL = 60, padR = 40, padT = 20, padB = 60
      const chartW = W - padL - padR
      const chartH = H - padT - padB

      const categories = ['Clima', 'Digital', 'Saúde', 'Educação', 'Infraestruturas']
      const series = (props.data as any).series as Array<{ label: string; color: string; values: number[] }>
      const maxVal = 3000

      const xPos = (i: number) => padL + (i / (categories.length - 1)) * chartW
      const yPos = (v: number) => padT + chartH - (v / maxVal) * chartH

      const yTicks = [0, 500, 1000, 1500, 2000, 2500, 3000]

      const areaPath = (vals: number[]) => {
        const pts = vals.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' L ')
        const bot = vals.map((_, i) => `${xPos(i)},${yPos(0)}`).reverse().join(' L ')
        return `M ${pts.split(' L ')[0]} L ${pts.split(' L ').slice(1).join(' L ')} L ${bot} Z`
      }

      const linePath = (vals: number[]) =>
        vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i)} ${yPos(v)}`).join(' ')

      return h('svg', {
        viewBox: `0 0 ${W} ${H}`,
        style: 'width:100%;'
      }, [
        // Gradient defs
        h('defs', {},
          series.map(s =>
            h('linearGradient', { id: `grad-${s.label.replace(' ', '')}`, x1: '0', y1: '0', x2: '0', y2: '1' }, [
              h('stop', { offset: '0%', 'stop-color': s.color, 'stop-opacity': '0.35' }),
              h('stop', { offset: '100%', 'stop-color': s.color, 'stop-opacity': '0.02' }),
            ])
          )
        ),

        // Grid lines
        ...yTicks.map(v =>
          h('line', {
            x1: padL, y1: yPos(v), x2: padL + chartW, y2: yPos(v),
            stroke: '#ccc', 'stroke-width': '0.5', 'stroke-dasharray': '3,3'
          })
        ),

        // Y axis labels
        ...yTicks.map(v =>
          h('text', {
            x: padL - 8, y: yPos(v),
            'text-anchor': 'end', 'dominant-baseline': 'middle',
            style: 'font-size:10px;fill:#666;font-family:inherit'
          }, v.toString())
        ),

        // Y axis title
        h('text', {
          x: 12, y: padT + chartH / 2,
          'text-anchor': 'middle',
          transform: `rotate(-90, 12, ${padT + chartH / 2})`,
          style: 'font-size:10px;fill:#888;font-family:inherit'
        }, '€ Milhões'),

        // Areas
        ...series.map(s =>
          h('path', {
            d: areaPath(s.values),
            fill: `url(#grad-${s.label.replace(' ', '')})`,
          })
        ),

        // Lines
        ...series.map(s =>
          h('path', {
            d: linePath(s.values),
            fill: 'none', stroke: s.color, 'stroke-width': '2',
          })
        ),

        // Dots
        ...series.flatMap(s =>
          s.values.map((v, i) =>
            h('circle', {
              cx: xPos(i), cy: yPos(v), r: 4,
              fill: 'white', stroke: s.color, 'stroke-width': '2'
            })
          )
        ),

        // X axis labels
        ...categories.map((c, i) =>
          h('text', {
            x: xPos(i), y: H - padB + 18,
            'text-anchor': 'middle',
            style: 'font-size:11px;fill:#444;font-family:inherit'
          }, c)
        ),

        // Legend
        ...series.flatMap((s, i) => {
          const lx = W / 2 - 120 + i * 100
          const ly = H - 12
          return [
            h('circle', { cx: lx, cy: ly, r: 4, fill: 'none', stroke: s.color, 'stroke-width': '1.5', 'stroke-dasharray': '2,2' }),
            h('text', { x: lx + 8, y: ly, 'dominant-baseline': 'middle', style: 'font-size:10px;fill:#555;font-family:inherit' }, s.label)
          ]
        })
      ])
    }
  }
})

const lineData = computed(() => ({
  series: [
    { label: 'Jan 2023', color: '#a5aee8', values: [240, 170, 90, 110, 30] },
    { label: 'Jan 2024', color: '#f4a08a', values: [1100, 1150, 590, 910, 310] },
    { label: 'Jan 2025', color: '#5dd9d0', values: [2320, 2210, 1270, 1860, 620] },
  ]
}))
</script>

<style scoped>
/* ── Base ── */
.inicio {
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  background: #e8eaed;
  min-height: 100vh;
  color: #1a2a5e;
}

/* ── HERO ── */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 80px;
  gap: 40px;
  min-height: 80vh;
}

.hero__left {
  flex: 1;
  max-width: 520px;
}

.hero__title {
  font-size: 3.6rem;
  font-weight: 800;
  line-height: 1.1;
  color: #1a2a5e;
  margin: 0 0 20px;
}

.hero__subtitle {
  font-size: 1rem;
  color: #555;
  margin-bottom: 32px;
  max-width: 400px;
  line-height: 1.6;
}

.hero__tags {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  max-width: 440px;
}

.tag {
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  border: 1px solid rgba(0,0,0,0.08);
}
.tag--green   { background: #b8e6c4; color: #1a4a2e; }
.tag--purple  { background: #d4c9f0; color: #3a1a6e; }
.tag--beige   { background: #e8d8b0; color: #4a3010; }
.tag--teal    { background: #a8ddd8; color: #0a3a36; }
.tag--salmon  { background: #f0c4bc; color: #5a1a14; }
.tag--white   { background: #ffffff; color: #333; }

.hero__right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.chart-wrapper {
  width: 100%;
  max-width: 320px;
}

.execucao-card {
  background: white;
  border-radius: 12px;
  padding: 18px 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 320px;
  text-align: center;
}

.execucao-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a2a5e;
}

/* ── PRR INFO ── */
.prr-info {
  padding: 0 80px 60px;
}

.prr-info__card {
  background: #2d3f7a;
  border-radius: 16px;
  padding: 40px 48px;
  color: white;
}

.prr-info__title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 16px;
  color: white;
}

.prr-info__desc {
  font-size: 0.92rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.85);
  margin-bottom: 32px;
}

.prr-info__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.prr-info__col {
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 24px 28px;
}

.prr-info__col h3 {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 1.1rem;
}

.prr-info__col ul {
  list-style: disc;
  padding-left: 18px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prr-info__col li {
  font-size: 0.87rem;
  line-height: 1.55;
  color: rgba(255,255,255,0.82);
}

/* ── EVOLUÇÃO TEMPORAL ── */
.evolucao {
  padding: 0 80px 80px;
}

.evolucao__card {
  background: white;
  border-radius: 16px;
  padding: 40px 48px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.evolucao__title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a2a5e;
  text-align: center;
  margin: 0 0 32px;
  line-height: 1.4;
}

.evolucao__chart {
  background: white;
  border-radius: 16px;
  padding: 32px 40px 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    padding: 40px 24px;
  }
  .hero__title { font-size: 2.4rem; }
  .prr-info { padding: 0 24px 40px; }
  .prr-info__grid { grid-template-columns: 1fr; }
  .evolucao { padding: 0 24px 40px; }
}
</style>