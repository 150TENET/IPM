<script setup lang="ts">
// Página inicial - sem lógica por enquanto
</script>

<template>
  <section>
    <div class="hero">
      <div class="hero-left">
        <h1>Plano de<br>Recuperação<br>e Resiliência</h1>
        <p class="subtitle">
          Visualiza como os fundos estão a ser investidos, gastos
          e impactam a recuperação económica da Europa.
        </p>
        <div class="stats-grid">
          <div class="stat-pill green">Clima – 37%</div>
          <div class="stat-pill purple">Digital – 20%</div>
          <div class="stat-pill yellow">Educação – 15%</div>
          <div class="stat-pill blue">Saúde – 10%</div>
          <div class="stat-pill orange">Infraestruturas – 18%</div>
          <div class="stat-pill gray">27 Estados-Membro</div>
        </div>
      </div>

      <div class="hero-right">
        <div class="top-graphic">
          <div class="pie-wrapper">
            <div class="pie-label label-top">€225 mil milhões</div>
            <div class="pie-label label-left">€548 mil milhões</div>
            <div class="pie-label label-right">€723.8 mil milhões</div>
            <div class="pie-chart"></div>
          </div>
          <div class="legend">
            <div class="legend-item"><span class="dot available"></span><span>Total Disponível</span></div>
            <div class="legend-item"><span class="dot committed"></span><span>Total Comprometido</span></div>
            <div class="legend-item"><span class="dot paid"></span><span>Total Desembolsado</span></div>
          </div>
        </div>
        <div class="execution-box">% de Execução – 34.7%</div>
      </div>
    </div>

    <section class="info-panel">
      <h2>O que é o Plano de Recuperação e Resiliência (PRR)?</h2>
      <p class="info-text">
        O PRR é um programa de aplicação nacional, que visa implementar um conjunto de reformas e investimentos
        destinados a repor o crescimento económico sustentado após a pandemia. Financiado pela União Europeia
        através do mecanismo NextGenerationEU, o plano foca-se em preparar o país para os desafios do futuro,
        com especial ênfase na transição climática e na transformação digital.
      </p>
      <div class="info-columns">
        <div class="info-box">
          <h3>Objetivos Principais</h3>
          <ul>
            <li>Mitigação do impacto: Neutralizar os efeitos económicos e sociais negativos causados pela crise pandémica.</li>
            <li>Sustentabilidade futura: Reformar a economia para que seja mais resiliente, inclusiva e preparada para crises futuras.</li>
            <li>A Dupla Transição: Acelerar em simultâneo a neutralidade carbónica e a modernização tecnológica.</li>
            <li>Coesão Territorial: Reduzir as desigualdades entre regiões e promover o emprego de qualidade.</li>
          </ul>
        </div>
        <div class="info-box">
          <h3>Compromissos Mínimos</h3>
          <ul>
            <li>Meta Verde (37%): Pelo menos 37% de cada plano nacional deve ser investido em objetivos climáticos e biodiversidade.</li>
            <li>Meta Digital (20%): Um mínimo de 20% do orçamento deve ser dedicado à digitalização de empresas e serviços públicos.</li>
            <li>Reformas Estruturais: O dinheiro só é libertado se o país implementar reformas reais nas suas instituições e leis.</li>
            <li>Não Prejudicar (DNSH): O investimento não pode causar danos significativos ao meio ambiente.</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="chart-card">
      <h2 class="chart-title">Evolução Temporal – Total de pagamentos feitos em cada área até ao início do ano indicado</h2>
      <p class="chart-subtitle">€ Milhões</p>
      <svg viewBox="0 0 1000 560" class="chart-svg" aria-label="Gráfico de área">
        <g stroke="#e5e9f4" stroke-width="2">
          <line x1="90" y1="70" x2="90" y2="470"></line>
          <line x1="90" y1="470" x2="920" y2="470"></line>
          <line x1="90" y1="390" x2="920" y2="390"></line>
          <line x1="90" y1="310" x2="920" y2="310"></line>
          <line x1="90" y1="230" x2="920" y2="230"></line>
          <line x1="90" y1="150" x2="920" y2="150"></line>
          <line x1="90" y1="70" x2="920" y2="70"></line>
        </g>
        <path d="M160 130 L300 145 L460 300 L620 210 L780 405 L780 470 L160 470 Z" class="area-cyan-fill"/>
        <polyline points="160,130 300,145 460,300 620,210 780,405" class="area-cyan-line"/>
        <path d="M160 235 L300 225 L460 390 L620 315 L780 425 L780 470 L160 470 Z" class="area-red-fill"/>
        <polyline points="160,235 300,225 460,390 620,315 780,425" class="area-red-line"/>
        <path d="M160 340 L300 345 L460 385 L620 375 L780 448 L780 470 L160 470 Z" class="area-purple-fill"/>
        <polyline points="160,340 300,345 460,385 620,375 780,448" class="area-purple-line"/>
        <g class="axis-text">
          <text x="58" y="475">0</text>
          <text x="42" y="395">500</text>
          <text x="28" y="315">1000</text>
          <text x="28" y="235">1500</text>
          <text x="28" y="155">2000</text>
          <text x="28" y="75">2500</text>
        </g>
        <g class="axis-text">
          <text x="145" y="505">Clima</text>
          <text x="275" y="505">Digital</text>
          <text x="455" y="505">Saúde</text>
          <text x="585" y="505">Educação</text>
          <text x="730" y="505">Infraestruturas</text>
        </g>
        <g class="legend-text">
          <circle cx="390" cy="535" r="6" class="purple-ball"/>
          <text x="404" y="540">Jan 2023</text>
          <circle cx="510" cy="535" r="6" class="red-ball"/>
          <text x="524" y="540">Jan 2024</text>
          <circle cx="630" cy="535" r="6" class="cyan-ball"/>
          <text x="644" y="540">Jan 2025</text>
        </g>
      </svg>
    </section>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 470px 1fr;
  column-gap: 80px;
  align-items: start;
  padding: 86px 96px 20px;
}

.hero-left h1 {
  margin: 0;
  font-size: 66px;
  line-height: 0.98;
  font-weight: 800;
  color: #31499a;
  letter-spacing: -1px;
}

.subtitle {
  margin-top: 14px;
  max-width: 390px;
  font-size: 15px;
  line-height: 1.3;
  color: #9d9d9d;
}

.stats-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, 145px);
  gap: 8px 14px;
}

.stat-pill {
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6px 10px;
  border-radius: 5px;
  border: 1px solid rgba(70, 70, 70, 0.16);
  font-size: 13px;
  line-height: 1.1;
  color: #565656;
}

.green { background: #a8d5b6; }
.purple { background: #b7b1ea; }
.yellow { background: #e6c89f; }
.blue { background: #a9d5df; }
.orange { background: #dfb0a8; }
.gray { background: #e8e8e8; }

.hero-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
}

.top-graphic {
  display: flex;
  align-items: center;
  gap: 18px;
}

.pie-wrapper {
  position: relative;
  width: 295px;
  height: 220px;
}

.pie-chart {
  position: absolute;
  top: 8px;
  left: 38px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #7e6df0 0 43%,
    #f18b84 43% 84%,
    #48b9d4 84% 100%
  );
  box-shadow: inset 0 -12px 0 rgba(0, 0, 0, 0.08);
}

.pie-label {
  position: absolute;
  font-size: 13px;
  color: #31499a;
  line-height: 1;
  white-space: nowrap;
}

.label-top {
  top: 0;
  left: 58px;
}

.label-left {
  left: 8px;
  bottom: 18px;
}

.label-right {
  right: -2px;
  bottom: 38px;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-left: 6px;
  font-size: 13px;
  color: #9f9f9f;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 7px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.available { background: #7e6df0; }
.committed { background: #f18b84; }
.paid { background: #48b9d4; }

.execution-box {
  margin-top: 18px;
  margin-left: 32px;
  border: 1px solid #b2b8c6;
  border-radius: 7px;
  padding: 14px 24px;
  color: #31499a;
  font-size: 19px;
  font-weight: 700;
  background: transparent;
}

.info-panel {
  max-width: 730px;
  margin: 16px auto 22px;
  background: #6375b6;
  border-radius: 6px;
  padding: 18px 26px 24px;
  color: white;
}

.info-panel h2 {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 700;
}

.info-text {
  margin: 0 0 14px;
  line-height: 1.3;
  font-size: 13px;
}

.info-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.info-box {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 5px;
  padding: 14px 16px;
}

.info-box h3 {
  margin: 0 0 10px;
  font-size: 15px;
}

.info-box ul {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  line-height: 1.35;
}

.chart-card {
  max-width: 730px;
  margin: 0 auto 40px;
  background: #efefef;
  border-radius: 6px;
  padding: 10px 14px 18px;
}

.chart-title {
  margin: 0;
  text-align: center;
  color: #31499a;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
}

.chart-subtitle {
  margin: 8px 0 0 34px;
  color: #666;
  font-size: 12px;
}

.chart-svg {
  width: 100%;
  height: auto;
  display: block;
}

.axis-text text,
.legend-text text {
  fill: #666;
  font-size: 18px;
}

.area-cyan-fill {
  fill: rgba(92, 210, 235, 0.22);
}

.area-cyan-line {
  fill: none;
  stroke: #60d2eb;
  stroke-width: 2.5;
}

.area-red-fill {
  fill: rgba(244, 151, 145, 0.14);
}

.area-red-line {
  fill: none;
  stroke: #f49791;
  stroke-width: 2.5;
}

.area-purple-fill {
  fill: rgba(134, 126, 255, 0.14);
}

.area-purple-line {
  fill: none;
  stroke: #867eff;
  stroke-width: 2.5;
}

.purple-ball { fill: #867eff; }
.red-ball { fill: #f49791; }
.cyan-ball { fill: #60d2eb; }
</style>