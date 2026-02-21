import { initDb } from '../../../lib/db.js'
   import { randomUUID } from 'crypto'

   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Método não permitido' })
     }
     
     const db = await initDb()
     const sessionId = randomUUID()
     
     await db.run(
       'INSERT INTO sessions (id, status) VALUES (?, ?)',
       [sessionId, 'iniciado']
     )
     
     res.status(200).json({ sessionId })
   }