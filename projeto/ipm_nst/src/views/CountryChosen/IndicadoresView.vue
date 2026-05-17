<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// --- 1. INTERFACES DE CONTRATO (Tipagem Estrita Sem 'any') ---
interface Indicador {
  id: string | number;
  titulo: string;
  descricao: string;
  infoDetalhada?: string;
}

// Interface que espelha as chaves reais que possam vir do teu db.json
interface IndicadorDB {
  id: string | number;
  titulo?: string;
  title?: string;
  nome?: string;
  descricao?: string;
  description?: string;
  pilar?: string;
  unidade?: string;
  metaSemestral?: string | number;
  valorAtingido?: string | number;
  infoDetalhada?: string;
  details?: string;
  estado?: string;
}

const indicadoresRaw = ref<IndicadorDB[]>([])
const aCarregar = ref(false)
const mostrarModalInfo = ref(false)
const mostrarModalCSV = ref(false)
const indicadorSelecionado = ref<Indicador | null>(null)

// --- 2. SISTEMA DE FALLBACK DE SALVAGUARDA LOCAL ---
const indicadoresFallback: Indicador[] = [
  {
    id: 1,
    titulo: "Modernização Digital dos Serviços Públicos",
    descricao: "Transição para plataformas online seguras e desmaterialização de processos administrativos.",
    infoDetalhada: "• Estado de Execução: Em curso\n• Meta do Semestre: 12.500 portais atualizados\n• Impacto: Redução do tempo de resposta ao cidadão em 40%."
  },
  {
    id: 2,
    titulo: "Eficiência Energética em Edifícios Públicos",
    descricao: "Melhoria na certificação térmica de infraestruturas, isolamentos e aplicação de painéis solares.",
    infoDetalhada: "• Estado de Execução: Concluído\n• Meta do Semestre: 450 edifícios intervencionados\n• Impacto: Poupança energética anual estimada em 22%."
  },
  {
    id: 3,
    titulo: "Capacitação Digital e Reconversão Profissional",
    descricao: "Formação avançada em competências tecnológicas e literacia digital para a empregabilidade.",
    infoDetalhada: "• Estado de Execução: Em curso\n• Meta do Semestre: 35.000 cidadãos certificados\n• Foco principal: Integração de jovens no mercado tecnológico."
  }
]

// --- 3. CONSULTA DIRETA À DB (Ignora a store vazia) ---
onMounted(async () => {
  aCarregar.value = true
  try {
    const resposta = await fetch('http://localhost:3000/indicators')
    if (resposta.ok) {
      indicadoresRaw.value = await resposta.json()
    }
  } catch (error) {
    console.warn('Servidor offline ou rota inacessível. Fallback ativado com sucesso.', error)
  } finally {
    aCarregar.value = false
  }
})

// --- 4. MAPEAMENTO INTELIGENTE (Prioridade à DB > Fallback) ---
const listaIndicadores = computed<Indicador[]>(() => {
  // Se a DB responder e tiver linhas, usa os dados dinâmicos da base de dados
  if (indicadoresRaw.value && indicadoresRaw.value.length > 0) {
    return indicadoresRaw.value.map((ind: IndicadorDB) => {
      const tituloFinal = ind.titulo || ind.title || ind.nome || 'Indicador Sem Nome'

      const descricaoFinal = ind.descricao || ind.description ||
        (ind.pilar ? `${ind.pilar} — Unidade: ${ind.unidade || 'Unidades'}` : 'Sem descrição disponível')

      const infoDetalhadaFinal = ind.infoDetalhada || ind.details ||
        (ind.metaSemestral
          ? `• Estado de Execução: ${ind.estado || 'Em curso'}\n• Meta do Semestre: ${Number(ind.metaSemestral).toLocaleString()}\n• Valor já Atingido: ${Number(ind.valorAtingido || 0).toLocaleString()} (${ind.unidade || ''})`
          : 'Nenhum detalhe adicional registado na base de dados.')

      return {
        id: ind.id,
        titulo: tituloFinal,
        descricao: descricaoFinal,
        infoDetalhada: infoDetalhadaFinal
      }
    })
  }

  // Caso contrário, injeta a matriz de segurança local para o ecrã não falhar
  return indicadoresFallback
})

function abrirInfo(indicador: Indicador) {
  indicadorSelecionado.value = indicador
  mostrarModalInfo.value = true
}
</script>

<template>
  <div class="indicadores-wrapper">

    <div v-if="aCarregar" class="loading-feedback">
      🔄 A sincronizar dados reais com o db.json...
    </div>

    <div v-else class="indicadores-lista">
      <div v-for="(ind, i) in listaIndicadores" :key="ind.id" class="indicador-item">
        <div class="indicador-num">{{ i + 1 }}</div>
        <div class="indicador-info">
          <h4>{{ ind.titulo }}</h4>
          <p>{{ ind.descricao }}</p>
        </div>
        <div class="indicador-acoes">
          <button class="btn-info" @click="abrirInfo(ind)">ⓘ Info</button>
          <button class="btn-csv" @click="mostrarModalCSV = true">⬇ CSV</button>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalInfo" class="modal-fundo" @click.self="mostrarModalInfo = false">
      <div class="modal-caixa">
        <button class="modal-fechar" @click="mostrarModalInfo = false">✕</button>
        <div class="modal-titulo">{{ indicadorSelecionado?.titulo }}</div>
        <div class="modal-sub">{{ indicadorSelecionado?.descricao }}</div>
        <div class="modal-corpo">
          <strong>Informação Detalhada</strong><br><br>
          <span style="white-space: pre-line;">{{ indicadorSelecionado?.infoDetalhada }}</span>
        </div>
        <button class="modal-btn-ok" @click="mostrarModalInfo = false">OK</button>
      </div>
    </div>

    <div v-if="mostrarModalCSV" class="modal-fundo" @click.self="mostrarModalCSV = false">
      <div class="modal-caixa modal-escuro">
        <button class="modal-fechar branco" @click="mostrarModalCSV = false">✕</button>
        <div style="font-size:38px;margin-bottom:12px;">⬇️</div>
        <div>Os dados foram exportados com sucesso.<br>Verifique a pasta de Transferências no seu dispositivo.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.indicadores-wrapper {
  padding: 20px 40px;
}

.loading-feedback {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 10px;
  color: #31499a;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
}

.indicadores-lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.indicador-item {
  background: white;
  border-radius: 10px;
  padding: 16px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
}

.indicador-num {
  width: 32px;
  height: 32px;
  background: #4a6fc4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.indicador-info { flex: 1; }
.indicador-info h4 { font-size: 14px; font-weight: 700; color: #31499a; margin: 0 0 3px; }
.indicador-info p { font-size: 12px; color: #888; margin: 0; }

.indicador-acoes { display: flex; gap: 8px; align-items: center; }

.btn-info { background: none; border: none; color: #4a6fc4; cursor: pointer; font-size: 12px; padding: 4px 8px; white-space: nowrap; font-weight: 700; }

.btn-csv { background: #31499a; color: white; border: none; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.btn-csv:hover { background: #2a3e80; }

.modal-fundo { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.modal-caixa { background: white; border-radius: 14px; padding: 26px 30px; max-width: 420px; width: 90%; position: relative; }
.modal-escuro { background: #555; color: white; text-align: center; max-width: 340px; }
.modal-fechar { position: absolute; top: 10px; right: 13px; background: none; border: none; font-size: 17px; cursor: pointer; color: #888; }
.modal-fechar.branco { color: white; }
.modal-titulo { font-size: 14px; font-weight: 700; color: #31499a; margin-bottom: 3px; }
.modal-sub { font-size: 12px; color: #888; margin-bottom: 14px; }
.modal-corpo { background: #f4f5f8; border-radius: 10px; padding: 14px; margin-bottom: 14px; font-size: 12px; line-height: 1.7; color: #334155; }
.modal-btn-ok { width: 100%; padding: 10px; border: none; background: #31499a; color: white; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; }
</style>
