import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getQuestionsByFase } from '@/data/questions'

export default function TestePage() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [perguntaAtual, setPerguntaAtual] = useState(null)
  const [fase, setFase] = useState(0)
  const [perguntaIndex, setPerguntaIndex] = useState(0)
  const [respostas, setRespostas] = useState([])
  const [inicioPergunta, setInicioPergunta] = useState(null)

  useEffect(() => {
    if (id) {
      carregarPergunta()
    }
  }, [id])

  // Iniciar timer quando uma nova pergunta é carregada
  useEffect(() => {
    if (perguntaAtual) {
      setInicioPergunta(Date.now())
    }
  }, [perguntaAtual])

  function carregarPergunta() {
    const perguntasFase = getQuestionsByFase(fase)
    
    if (perguntaIndex < perguntasFase.length) {
      setPerguntaAtual(perguntasFase[perguntaIndex])
    } else {
      // Avançar para próxima fase
      if (fase < 2) {
        setFase(fase + 1)
        setPerguntaIndex(0)
      } else {
        // Teste completo
        finalizarTeste()
      }
    }
    setLoading(false)
  }

  async function responder(resposta) {
    // Calcular tempo gasto na pergunta
    const tempoGasto = inicioPergunta ? Date.now() - inicioPergunta : 0
    
    // Salvar no banco com o tempo
    await fetch(`/api/session/${id}/resposta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: perguntaAtual.id,
        resposta: resposta,
        timeMs: tempoGasto
      })
    })
    
    const novaResposta = {
      questionId: perguntaAtual.id,
      resposta: resposta,
      timeMs: tempoGasto
    }
    
    setRespostas([...respostas, novaResposta])
    setPerguntaIndex(perguntaIndex + 1)
    setLoading(true)
    carregarPergunta()
  }

  async function finalizarTeste() {
    alert('Teste completo! (Por enquanto)')
    // Amanhã: salvar todas respostas e processar
  }

  // Calcular progresso
  const totalPerguntas = getQuestionsByFase(0).length + 
                         getQuestionsByFase(1).length + 
                         getQuestionsByFase(2).length
   
  const respondidas = respostas.length
  const progresso = (respondidas / totalPerguntas) * 100

  // Calcular número da pergunta atual considerando todas as fases
  const numeroPerguntaGlobal = respondidas + 1

  if (loading) return <div>Carregando...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progresso}%` }}
          ></div>
        </div>

        {/* Mensagem de conforto */}
        <div className="text-xs text-gray-400 mb-4">
          Pergunta {numeroPerguntaGlobal} de {totalPerguntas}
        </div>
        
        <div className="mb-4 text-sm text-gray-500">
          Fase {fase} • Pergunta {perguntaIndex + 1}/{getQuestionsByFase(fase).length}
        </div>
        
        <h2 className="text-xl font-semibold mb-6">
          {perguntaAtual?.texto}
        </h2>

        {perguntaAtual?.tipo === 'multiple-choice' && (
          <div className="space-y-3">
            {perguntaAtual.opcoes.map((opcao, idx) => (
              <button
                key={idx}
                onClick={() => responder(opcao)}
                className="w-full text-left p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
              >
                {opcao}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}