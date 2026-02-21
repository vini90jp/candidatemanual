import { initDb } from '../../../../lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const { id } = req.query
  const { events } = req.body

  if (!events || !Array.isArray(events)) {
    return res.status(400).json({ error: 'Eventos inválidos' })
  }

  const db = await initDb()

  // Inserir eventos em lote
  for (const event of events) {
    await db.run(
      `INSERT INTO events (session_id, event_type, event_data, timestamp) 
       VALUES (?, ?, ?, datetime(?, 'unixepoch'))`,
      [id, event.type, JSON.stringify(event), Math.floor(event.timestamp / 1000)]
    )
  }

  res.status(200).json({ received: events.length })
}