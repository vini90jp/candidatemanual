import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getQuestionsByFase } from '../../lib/questions'
import { useMouseTracking } from '../../hooks/useMouseTracking'

export default function TestePage() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [perguntaAtual, setPerguntaAtual] = useState(null)
  const [fase, setFase] = useState(0)
  const [perguntaIndex, setPerguntaIndex] = useState(0)
  const [respostas, setRespostas] = useState([])
  const [inicioPergunta, setInicioPergunta] = useState(null)
  const [respostaAberta, setRespostaAberta] = useState('')
  const [valoresSlider, setValoresSlider] = useState({})
  // Ativar mouse tracking
  useMouseTracking(id, true)

  // Adicionar também tracking de perda de foco
  useEffect(() => {
    const handleBlur = () => {
      // Usuário mudou de aba
      fetch(`/api/session/${id}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          events: [{
            type: 'focus_loss',
            timestamp: Date.now()
          }]
        })
      })
    }

    const handleFocus = () => {
      fetch(`/api/session/${id}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          events: [{
            type: 'focus_return',
            timestamp: Date.now()
          }]
        })
      })
    }

    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
    }
  }, [id])

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
      
      // Resetar estados específicos para nova pergunta
      setRespostaAberta('')
      setValoresSlider({})

      // Se for pergunta do tipo slider, inicializar com valores zero
      if (perguntasFase[perguntaIndex].tipo === 'slider') {
        const initialSlider = {}
        perguntasFase[perguntaIndex].opcoes.forEach(opcao => {
          initialSlider[opcao] = 0
        })
        setValoresSlider(initialSlider)
      }
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
    const fimPergunta = Date.now()
    
    // Calcular tempo gasto na pergunta
    const tempoGasto = inicioPergunta ? fimPergunta - inicioPergunta : 0
    
    // Salvar resposta com tempo
    await fetch(`/api/session/${id}/resposta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: perguntaAtual.id,
        resposta: resposta,
        timeMs: tempoGasto
      })
    })
    
    // Registrar metadados da resposta
    await fetch(`/api/session/${id}/metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: perguntaAtual.id,
        metadata: {
          hesitacao: tempoGasto > 10000 ? 'alta' : 'normal',
          tamanhoResposta: resposta.length,
          timestampResposta: fimPergunta
        }
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

        {perguntaAtual.tipo === 'multiple-choice' && (
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

        {perguntaAtual.tipo === 'likert' && (
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

        {perguntaAtual.tipo === 'open' && (
          <div className="space-y-4">
            <textarea
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[120px]"
              placeholder="Digite sua resposta aqui..."
              value={respostaAberta}
              onChange={(e) => setRespostaAberta(e.target.value)}
            />
            <button
              onClick={() => {
                if (respostaAberta.trim()) {
                  responder(respostaAberta)
                  setRespostaAberta('') // limpa para próxima pergunta
                } else {
                  alert('Por favor, digite uma resposta')
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Responder
            </button>
          </div>
        )}

        {perguntaAtual.tipo === 'slider' && (
          <div className="space-y-6">
            <p className="text-gray-600 mb-4">Arraste os sliders para distribuir 100 pontos:</p>
            {perguntaAtual.opcoes.map((opcao, idx) => (
              <div key={idx} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {opcao}: {valoresSlider[opcao] || 0}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  className="w-full"
                  value={valoresSlider[opcao] || 0}
                  onChange={(e) => {
                    setValoresSlider({
                      ...valoresSlider,
                      [opcao]: parseInt(e.target.value)
                    })
                  }}
                />
              </div>
            ))}
            <button
              onClick={() => {
                // Calcular total
                const total = Object.values(valoresSlider).reduce((sum, val) => sum + val, 0)
                
                if (total === 100) {
                  responder(JSON.stringify(valoresSlider))
                  setValoresSlider({}) // limpa para próxima pergunta
                } else {
                  alert(`A soma deve ser 100. Atual: ${total}`)
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mt-4"
            >
              Confirmar distribuição
            </button>
          </div>
        )}
      </div>
    </div>
  )
}