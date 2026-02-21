import { initDb } from '../../../lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const db = await initDb()
  const sessoes = await db.all('SELECT * FROM sessions ORDER BY created_at DESC')
  
  res.status(200).json({ sessoes })
}