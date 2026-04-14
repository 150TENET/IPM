<script setup lang="ts">
// Página inicial - sem lógica por enquanto
</script>

<template>
  <section>
    <!-- Hero -->
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

    <!-- Painel informativo -->
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
          <h3>📈 Objetivos Principais</h3>
          <ul>
            <li>Mitigação do impacto: Neutralizar os efeitos económicos e sociais negativos causados pela crise pandémica.</li>
            <li>Sustentabilidade futura: Reformar a economia para que seja mais resiliente, inclusiva e preparada para crises futuras.</li>
            <li>A Dupla Transição: Acelerar em simultâneo a neutralidade carbónica e a modernização tecnológica.</li>
            <li>Coesão Territorial: Reduzir as desigualdades entre regiões e promover o emprego de qualidade.</li>
          </ul>
        </div>
        <div class="info-box">
          <h3>✅ Compromissos Mínimos</h3>
          <ul>
            <li>Meta Verde (37%): Pelo menos 37% de cada plano nacional deve ser investido em objetivos climáticos e biodiversidade.</li>
            <li>Meta Digital (20%): Um mínimo de 20% do orçamento deve ser dedicado à digitalização de empresas e serviços públicos.</li>
            <li>Reformas Estruturais: O dinheiro só é libertado se o país implementar reformas reais nas suas instituições e leis.</li>
            <li>Não Prejudicar (DNSH): O investimento não pode causar danos significativos ao meio ambiente.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Gráfico -->
    <section class="chart-card">
      <h2 class="chart-title">Evolução Temporal – Total de pagamentos feitos em cada área até ao início do ano indicado</h2>
      <p class="chart-subtitle">€ Milhões</p>
      <svg viewBox="0 0 1000 560" class="chart-svg" aria-label="Gráfico de área">
        <g stroke="#e5e9f4" stroke-width="2">
          <line x1="90" y1="70"  x2="90"  y2="470"></line>
          <line x1="90" y1="470" x2="920" y2="470"></line>
          <line x1="90" y1="390" x2="920" y2="390"></line>
          <line x1="90" y1="310" x2="920" y2="310"></line>
          <line x1="90" y1="230" x2="920" y2="230"></line>
          <line x1="90" y1="150" x2="920" y2="150"></line>
          <line x1="90" y1="70"  x2="920" y2="70"></line>
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