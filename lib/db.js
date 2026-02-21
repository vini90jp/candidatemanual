import sqlite3 from 'sqlite3'
   import { open } from 'sqlite'
   import path from 'path'

   export async function openDb() {
     return open({
       filename: path.join(process.cwd(), 'candidatemanual.sqlite'),
       driver: sqlite3.Database
     })
   }

   export async function initDb() {
     const db = await openDb()
     
     await db.exec(`
       CREATE TABLE IF NOT EXISTS sessions (
         id TEXT PRIMARY KEY,
         candidate_name TEXT,
         status TEXT,
         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
       );
       
       CREATE TABLE IF NOT EXISTS responses (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         session_id TEXT,
         question_id TEXT,
         response TEXT,
         time_ms INTEGER,
         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
       );
       
       CREATE TABLE IF NOT EXISTS events (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         session_id TEXT,
         event_type TEXT,
         event_data TEXT,
         timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
       );
     `)
     
     return db
   }