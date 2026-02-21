import { initDb } from '../../../../lib/db.js'

export default async function handler(req, res) {
  const { id } = req.query
  const db = await initDb()
  
  const eventos = await db.all(
    'SELECT * FROM events WHERE session_id = ? ORDER BY timestamp',
    [id]
  )
  
  res.status(200).json({ eventos })
}