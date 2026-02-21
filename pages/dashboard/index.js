import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [sessoes, setSessoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarSessoes()
  }, [])

  async function carregarSessoes() {
  try {
    const response = await fetch('/api/session/listar')
    const data = await response.json()
    setSessoes(data.sessoes || [])
  } catch (error) {
    console.error('Erro ao carregar sessões:', error)
  } finally {
    setLoading(false)
  }
    }

  async function criarSessao() {
  try {
    const response = await fetch('/api/session/criar', {
      method: 'POST'
    })
    const data = await response.json()
    
    if (data.sessionId) {
      const link = `${window.location.origin}/teste/${data.sessionId}`
      
      // Criar elemento de input para copiar link
      const input = document.createElement('input')
      input.value = link
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      
      alert('Link copiado para área de transferência!')
      
      // Recarregar lista de sessões
      carregarSessoes()
        }
    } catch (error) {
            alert('Erro ao criar teste: ' + error.message)
        }
    }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">CandidateManual</h1>
          <button
            onClick={criarSessao}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Novo Teste
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Testes Recentes</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">Carregando...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Candidato</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Data</th>
                  <th className="p-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sessoes.map(sessao => (
                  <tr key={sessao.id} className="border-t">
                    <td className="p-3">{sessao.candidate_name || '---'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        sessao.status === 'completo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sessao.status}
                      </span>
                    </td>
                    <td className="p-3">{sessao.data}</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline mr-3">Ver</button>
                      <button className="text-gray-600 hover:underline">Link</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}