import { useEffect, useState } from 'react'

export default function DebugTracking() {
  const [sessoes, setSessoes] = useState([])
  const [eventosSelecionados, setEventosSelecionados] = useState([])
  const [sessionSelecionada, setSessionSelecionada] = useState(null)

  useEffect(() => {
    fetch('/api/session/listar')
      .then(res => res.json())
      .then(data => setSessoes(data.sessoes))
  }, [])

  async function carregarEventos(sessionId) {
    const res = await fetch(`/api/debug/eventos/${sessionId}`)
    const data = await res.json()
    setEventosSelecionados(data.eventos)
    setSessionSelecionada(sessionId)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Debug: Eventos de Tracking</h1>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="font-semibold mb-3">Sessões</h2>
          <div className="space-y-2">
            {sessoes.map(s => (
              <button
                key={s.id}
                onClick={() => carregarEventos(s.id)}
                className={`w-full text-left p-2 rounded ${
                  sessionSelecionada === s.id ? 'bg-blue-100' : 'bg-gray-50'
                }`}
              >
                <div className="text-sm font-mono">{s.id.substring(0,8)}...</div>
                <div className="text-xs text-gray-500">{s.created_at}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <h2 className="font-semibold mb-3">Eventos</h2>
          <div className="bg-gray-50 p-4 rounded h-96 overflow-auto">
            <pre className="text-xs">
              {JSON.stringify(eventosSelecionados, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
