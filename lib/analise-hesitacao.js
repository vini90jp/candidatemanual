export function detectarHesitacao(eventos, perguntaId, inicioPergunta, fimPergunta) {
  // Filtrar eventos desta pergunta
  const eventosPergunta = eventos.filter(e => 
    e.timestamp >= inicioPergunta && e.timestamp <= fimPergunta
  )

  // 1. Movimentos de vai-e-vem (mouse indo para uma opção e voltando)
  let hesitacaoCount = 0
  let ultimoX = null
  let direcao = null

  eventosPergunta.forEach(evento => {
    if (evento.type === 'mousemove') {
      if (ultimoX !== null) {
        const novaDirecao = evento.x > ultimoX ? 'direita' : 'esquerda'
        if (direcao && novaDirecao !== direcao) {
          hesitacaoCount++
        }
        direcao = novaDirecao
      }
      ultimoX = evento.x
    }
  })

  // 2. Cliques perdidos (clicou perto mas não no botão)
  const cliquesPerdidos = eventosPergunta.filter(e => 
    e.type === 'click' && e.target !== 'BUTTON' && e.target !== 'DIV'
  ).length

  // 3. Tempo parado (sem movimento por mais de 2 segundos)
  let paradoCount = 0
  let ultimoTimestamp = null

  eventosPergunta.forEach(evento => {
    if (evento.type === 'mousemove') {
      if (ultimoTimestamp && (evento.timestamp - ultimoTimestamp) > 2000) {
        paradoCount++
      }
      ultimoTimestamp = evento.timestamp
    }
  })

  // Score de hesitação (0-100)
  const score = Math.min(
    (hesitacaoCount * 5) + (cliquesPerdidos * 10) + (paradoCount * 8),
    100
  )

  return {
    score,
    metrics: {
      hesitacaoCount,
      cliquesPerdidos,
      paradoCount
    }
  }
}