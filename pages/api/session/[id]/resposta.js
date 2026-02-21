import { initDb } from '../../../../lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const { id } = req.query
  const { questionId, resposta, timeMs } = req.body
  
  const db = await initDb()
  
  await db.run(
    'INSERT INTO responses (session_id, question_id, response, time_ms) VALUES (?, ?, ?, ?)',
    [id, questionId, resposta, timeMs || 0]
  )
  
  res.status(200).json({ success: true })
}