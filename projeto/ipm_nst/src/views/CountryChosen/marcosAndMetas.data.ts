export type BarSeries = {
  name: string
  value: number
  color: string
}

export type BarCategory = {
  label: string
  series: BarSeries[]
}

export type PieSegment = {
  label: string
  value: number
  color: string
}

export type MilestoneItem = {
  title: string
  category: string
  date: string
  progress: number
  status: 'Concluído' | 'Em progresso' | 'Pendente'
}

export const barCategories: BarCategory[] = [
  {
    label: 'Clima',
    series: [
      { name: 'Planeado', value: 88, color: '#c7cad9' },
      { name: 'Em curso', value: 72, color: '#5d6ee6' },
      { name: 'Concluído', value: 48, color: '#1db954' },
    ],
  },
  {
    label: 'Saúde',
    series: [
      { name: 'Planeado', value: 96, color: '#c7cad9' },
      { name: 'Em curso', value: 64, color: '#5d6ee6' },
      { name: 'Concluído', value: 56, color: '#1db954' },
    ],
  },
  {
    label: 'Educação',
    series: [
      { name: 'Planeado', value: 74, color: '#c7cad9' },
      { name: 'Em curso', value: 61, color: '#5d6ee6' },
      { name: 'Concluído', value: 42, color: '#1db954' },
    ],
  },
  {
    label: 'Transporte',
    series: [
      { name: 'Planeado', value: 83, color: '#c7cad9' },
      { name: 'Em curso', value: 68, color: '#5d6ee6' },
      { name: 'Concluído', value: 51, color: '#1db954' },
    ],
  },
  {
    label: 'Digital',
    series: [
      { name: 'Planeado', value: 68, color: '#c7cad9' },
      { name: 'Em curso', value: 79, color: '#5d6ee6' },
      { name: 'Concluído', value: 33, color: '#1db954' },
    ],
  },
]

export const pieSegments: PieSegment[] = [
  { label: 'Clima', value: 28, color: '#ff7a59' },
  { label: 'Saúde', value: 22, color: '#f7b84b' },
  { label: 'Educação', value: 18, color: '#5d6ee6' },
  { label: 'Digital', value: 17, color: '#4cc9f0' },
  { label: 'Infraestrutura', value: 15, color: '#31c48d' },
]

export const milestoneItems: MilestoneItem[] = [
  {
    title: 'Implementação da plataforma digital de serviços públicos',
    category: 'Digital',
    date: '24/03/2026',
    progress: 100,
    status: 'Concluído',
  },
  {
    title: 'Renovação energética de 1000 edifícios públicos',
    category: 'Clima',
    date: '12/02/2026',
    progress: 68,
    status: 'Em progresso',
  },
  {
    title: 'Criação de 50 centros de saúde comunitários',
    category: 'Saúde',
    date: '21/01/2026',
    progress: 100,
    status: 'Concluído',
  },
  {
    title: 'Formação de 10,000 profissionais em competências digitais',
    category: 'Educação',
    date: '05/01/2026',
    progress: 54,
    status: 'Pendente',
  },
  {
    title: 'Expansão da rede de transportes públicos elétricos',
    category: 'Transporte',
    date: '24/12/2025',
    progress: 73,
    status: 'Em progresso',
  },
]
