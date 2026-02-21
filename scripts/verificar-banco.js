import { initDb } from '../lib/db.js'

async function verificar() {
  const db = await initDb()
  
  const sessoes = await db.all('SELECT * FROM sessions')
  console.log('Sessões:', sessoes)
  
  const respostas = await db.all('SELECT * FROM responses')
  console.log('Respostas:', respostas)
  
  const eventos = await db.all('SELECT * FROM events')
  console.log('Eventos:', eventos)
}

verificar()