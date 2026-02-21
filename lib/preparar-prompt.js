export async function prepararDadosParaDeepSeek(sessionId) {
  const db = await initDb()
  
  // Buscar todas as respostas
  const respostas = await db.all(
    'SELECT * FROM responses WHERE session_id = ? ORDER BY created_at',
    [sessionId]
  )
  
  // Buscar eventos para análise de comportamento
  const eventos = await db.all(
    'SELECT * FROM events WHERE session_id = ? ORDER BY timestamp',
    [sessionId]
  )
  
  // Buscar metadados
  const metadados = eventos.filter(e => e.event_type === 'response_metadata')
  
  // Calcular métricas agregadas
  const tempoMedio = respostas.reduce((acc, r) => acc + r.time_ms, 0) / respostas.length
  const perdaFoco = eventos.filter(e => e.event_type === 'focus_loss').length
  
  // Detectar hesitação por pergunta (simplificado)
  const hesitacaoPorPergunta = {}
  respostas.forEach(r => {
    const metadata = metadados.find(m => 
      JSON.parse(m.event_data).questionId === r.question_id
    )
    hesitacaoPorPergunta[r.question_id] = {
      tempo: r.time_ms,
      hesitacao: r.time_ms > 10000 ? 'alta' : 'normal',
      ...metadata
    }
  })

  return {
    sessionId,
    totalRespostas: respostas.length,
    tempoMedio,
    perdaFoco,
    hesitacaoPorPergunta,
    respostas: respostas.map(r => ({
      pergunta: r.question_id,
      resposta: r.response,
      tempo: r.time_ms
    }))
  }
}