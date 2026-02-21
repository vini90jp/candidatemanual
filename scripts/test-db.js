import { initDb } from '../lib/db.js'
   initDb().then(() => console.log('Banco criado!'))