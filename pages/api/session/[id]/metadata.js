import { initDb } from '../../../../lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const { id } = req.query
  const { questionId, metadata } = req.body

  const db = await initDb()
  
  // Por enquanto, vamos guardar metadata como evento especial
  await db.run(
    `INSERT INTO events (session_id, event_type, event_data, timestamp) 
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
    [id, 'response_metadata', JSON.stringify({ questionId, ...metadata })]
  )

  res.status(200).json({ success: true })
}