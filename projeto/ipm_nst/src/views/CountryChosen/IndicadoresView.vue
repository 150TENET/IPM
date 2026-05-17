<script setup lang="ts">
import { ref, computed } from 'vue'

// --- 1. INTERFACE DE CONTRATO DO COMPONENTE (Tipagem Estrita) ---
interface Indicador {
  id: string | number;
  titulo: string;
  descricao: string;
  infoDetalhada?: string;
}

const mostrarModalInfo = ref(false)
const mostrarModalCSV = ref(false)
const indicadorSelecionado = ref<Indicador | null>(null)

// --- 2. MATRIZ OFICIAL DOS 14 INDICADORES OBRIGATÓRIOS DA UE ---
// Garante que a página fica preenchida e idêntica ao vosso protótipo original
const listaIndicadores = computed<Indicador[]>(() => [
  {
    id: 1,
    titulo: "Poupança no consumo anual de energia primária",
    descricao: "Mede a eficiência energética alcançada.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Transição Verde\n• Detalhes: Quantifica a redução do consumo de energia primária obtida através de renovações térmicas de edifícios, modernização de frotas e otimização de sistemas industriais."
  },
  {
    id: 2,
    titulo: "Capacidade operacional adicional instalada para energias renováveis",
    descricao: "Frente ao aumento da potência de fontes limpas.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Transição Verde\n• Detalhes: Monitoriza o aumento da capacidade de produção de energia a partir de fontes renováveis (solar, eólica, hídrica ou hidrogénio verde) expressa em MW."
  },
  {
    id: 3,
    titulo: "Infraestrutura de combustíveis alternativos",
    descricao: "Número de pontos de reabastecimento ou carregamento instalados.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Transição Verde\n• Detalhes: Contabiliza os novos pontos de carregamento elétrico públicos e estações de reabastecimento de combustíveis alternativos implementados no território."
  },
  {
    id: 4,
    titulo: "População beneficiada por medidas de proteção contra catástrofes",
    descricao: "Inclui proteção contra cheias, incêndios florestais e outros desastres climáticos.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Transição Verde / Resiliência\n• Detalhes: Regista o número de cidadãos residentes em áreas agora protegidas por infraestruturas de mitigação de riscos climáticos e sistemas de monitorização."
  },
  {
    id: 5,
    titulo: "Alojamentos adicionais com acesso à internet de capacidade muito elevada",
    descricao: "Mede a expansão da rede de fibra/conectividade.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Transição Digital\n• Detalhes: Contabiliza o número de agregados familiares e empresas que passaram a usufruir de cobertura de redes de comunicações Gigabit (VHCN)."
  },
  {
    id: 6,
    titulo: "Empresas apoiadas no desenvolvimento de produtos/processos digitais",
    descricao: "Foco na digitalização do setor privado.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Transição Digital\n• Detalhes: Apoio direto a micro, pequenas e médias empresas para a integração de comércio eletrónico, inteligência artificial, cloud computing e cibersegurança."
  },
  {
    id: 7,
    titulo: "Utilizadores de novos/melhorados serviços públicos digitais",
    descricao: "Mede a adesão dos cidadãos à administração pública online.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Transição Digital\n• Detalhes: Mede o número de cidadãos que interagem com o Estado através de novos portais governamentais totalmente desmaterializados."
  },
  {
    id: 8,
    titulo: "Investigadores que trabalham em instalações de investigação apoiadas",
    descricao: "Apoio e investimento em ciência e inovação.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Inovação e Coesão Territorial\n• Detalhes: Contabiliza os postos de trabalho científicos de tempo inteiro criados ou mantidos em laboratórios e centros de excelência modernizados."
  },
  {
    id: 9,
    titulo: "Empresas apoiadas",
    descricao: "Contabiliza o número total, especificando se são micro, pequenas, médias ou grandes empresas.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Crescimento Económico\n• Detalhes: Monitorização do tecido empresarial global que recebeu subvenções ou linhas de financiamento bonificadas ao abrigo do plano."
  },
  {
    id: 10,
    titulo: "Participantes em educação ou formação",
    descricao: "Número de pessoas que concluíram cursos ou qualificações.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Políticas Sociais e Competências\n• Detalhes: Regista o número de cidadãos que concluíram com sucesso ações de reconversão profissional (upskilling) ou cursos superiores apoiados."
  },
  {
    id: 11,
    titulo: "Pessoas em emprego ou em atividades de procura de emprego",
    descricao: "Mede o impacto direto no mercado de trabalho.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Resiliência Social\n• Detalhes: Acompanhamento de desempregados integrados em programas ativos de emprego ou orientados por gabinetes de inserção modernizados."
  },
  {
    id: 12,
    titulo: "Capacidade de instalações de cuidados de saúde novas ou modernizadas",
    descricao: "Apoio e reforço do sistema de saúde.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Saúde e Resiliência\n• Detalhes: Mede a capacidade máxima anual de atendimento (consultas ou camas) em hospitais e centros de saúde construídos ou reequipados."
  },
  {
    id: 13,
    titulo: "Capacidade de salas de aula em instalações de educação e cuidados infantis",
    descricao: "Foco na educação pré-escolar e escolar.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Coesão Social e Educação\n• Detalhes: Número de novos lugares ou vagas criadas em creches, jardins de infância e escolas modernizadas pelo fundo de recuperação."
  },
  {
    id: 14,
    titulo: "Número de jovens (15-29 anos) que recebem apoio",
    descricao: "Mede especificamente o impacto na juventude.",
    infoDetalhada: "• Tipo: Indicador Comum de Reporte Obrigatório\n• Pilar Estratégico: Próxima Geração\n• Detalhes: Monitoriza as verbas direcionadas para bolsas de estudo avançadas, estágios profissionais remunerados e programas de combate ao desemprego jovem."
  }
])

function abrirInfo(indicador: Indicador) {
  indicadorSelecionado.value = indicador
  mostrarModalInfo.value = true
}
</script>

<template>
  <div class="indicadores-wrapper">
    <div class="indicadores-lista">
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
          <strong>Métricas de Acompanhamento (Real-time)</strong><br><br>
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
.modal-titulo { font-size: 14px; font-weight: 700; color: #31499a; margin-bottom: 3px; line-height: 1.4; }
.modal-sub { font-size: 12px; color: #888; margin-bottom: 14px; }
.modal-corpo { background: #f4f5f8; border-radius: 10px; padding: 14px; margin-bottom: 14px; font-size: 12px; line-height: 1.7; color: #334155; }
.modal-btn-ok { width: 100%; padding: 10px; border: none; background: #31499a; color: white; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; }
</style>
