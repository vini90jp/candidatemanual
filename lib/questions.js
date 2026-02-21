const questions = [
  // FASE 0 - Aquecimento (perguntas neutras)
  {
    id: 'q0_1',
    fase: 0,
    texto: 'Como você prefere ser chamado?',
    tipo: 'open',
    opcoes: null
  },
  {
    id: 'q0_2',
    fase: 0,
    texto: 'Há quantos anos você trabalha formalmente?',
    tipo: 'multiple-choice',
    opcoes: ['Menos de 1 ano', '1-3 anos', '4-7 anos', '8-12 anos', 'Mais de 12 anos']
  },
  {
    id: 'q0_3',
    fase: 0,
    texto: 'Em uma escala de 1 a 5, como você está se sentindo agora?',
    tipo: 'likert',
    opcoes: ['1 - Muito cansado', '2 - Um pouco cansado', '3 - Neutro', '4 - Disposto', '5 - Muito disposto']
  },

  // FASE 1 - Exploração Superficial (autoavaliação direta)
  {
    id: 'q1_1',
    fase: 1,
    texto: 'Você prefere trabalhar com metas claras ou liberdade criativa?',
    tipo: 'multiple-choice',
    opcoes: ['Metas claras', 'Liberdade criativa', 'Equilíbrio entre ambos']
  },
  {
    id: 'q1_2',
    fase: 1,
    texto: 'Como você prefere receber feedback?',
    tipo: 'multiple-choice',
    opcoes: ['Público (na frente de outros)', 'Privado (apenas eu e o gestor)', 'Por escrito', 'Imediato, independente do formato']
  },
  {
    id: 'q1_3',
    fase: 1,
    texto: 'O que mais te motiva no trabalho?',
    tipo: 'multiple-choice',
    opcoes: ['Reconhecimento', 'Dinheiro', 'Propósito', 'Aprendizado', 'Relacionamentos']
  },
  {
    id: 'q1_4',
    fase: 1,
    texto: 'Descreva brevemente sua trajetória profissional',
    tipo: 'open',
    opcoes: null
  },

  // FASE 2 - Incursão Psicométrica (dilemas e narrativas)
  {
    id: 'q2_1',
    fase: 2,
    texto: 'Você está em um projeto com prazo apertado. Um colega não entregou a parte dele e isso vai atrasar tudo. O que você faz?',
    tipo: 'multiple-choice',
    opcoes: [
      'Assumo a parte dele para não atrasar',
      'Comunico o gestor imediatamente',
      'Cobro ele diretamente e dou suporte',
      'Entrego minha parte e deixo que ele se vire'
    ]
  },
  {
    id: 'q2_2',
    fase: 2,
    texto: 'Conte sobre um desafio profissional que você superou',
    tipo: 'open',
    opcoes: null
  },
  {
    id: 'q2_3',
    fase: 2,
    texto: 'Descreva o melhor chefe que você já teve',
    tipo: 'open',
    opcoes: null
  },
  {
    id: 'q2_4',
    fase: 2,
    texto: 'Distribua 100 pontos entre estes fatores (quanto mais pontos, mais importante)',
    tipo: 'slider',
    opcoes: ['Salário', 'Reconhecimento', 'Autonomia', 'Propósito', 'Estabilidade']
  }
]

export function getQuestionsByFase(fase) {
  return questions.filter(q => q.fase === fase)
}

export function getQuestionById(id) {
  return questions.find(q => q.id === id)
}

export default questions