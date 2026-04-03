import express from 'express';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Config ---
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || ''; 

app.use(express.json());
// Servir archivos estáticos desde la carpeta 'dist' (Vite build)
app.use(express.static(path.join(__dirname, 'dist')));

// --- In-memory fallback (si no hay DB) ---
let mem = { pageViews: 0, writes: 0 };

// --- Postgres pool ---
let pool = null;
if (DATABASE_URL) {
  pool = new Pool({ connectionString: DATABASE_URL, ssl: sslOption(DATABASE_URL) });
  (async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS pageviews(id SERIAL PRIMARY KEY, at TIMESTAMP DEFAULT NOW());
        CREATE TABLE IF NOT EXISTS writes(id SERIAL PRIMARY KEY, at TIMESTAMP DEFAULT NOW());
      `);
      console.log('DB ready');
    } catch (e) {
      console.error('DB init error:', e.message);
      pool = null; 
    }
  })();
}

function sslOption(cs) {
  return /amazonaws|render|railway|supabase|azure|gcp|neon|timescale|heroku/i.test(cs)
    ? { rejectUnauthorized: false }
    : undefined;
}

// --- Registrar vista de página ---
app.use(async (req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    try {
      if (pool) await pool.query('INSERT INTO pageviews DEFAULT VALUES;');
      else mem.pageViews++;
    } catch {}
  }
  next();
});

// --- API Endpoints ---
app.get('/api/time', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post('/api/demo-write', async (_req, res) => {
  try {
    if (pool) {
      await pool.query('INSERT INTO writes DEFAULT VALUES;');
      const total = (await pool.query('SELECT COUNT(*)::int AS n FROM writes')).rows[0].n;
      return res.json({ ok: true, total });
    } else {
      mem.writes++;
      return res.json({ ok: true, total: mem.writes });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/metrics', async (_req, res) => {
  try {
    if (pool) {
      const pv = (await pool.query('SELECT COUNT(*)::int AS n FROM pageviews')).rows[0].n;
      const wr = (await pool.query('SELECT COUNT(*)::int AS n FROM writes')).rows[0].n;
      res.json({ pageViews: pv, writes: wr, db: true });
    } else {
      res.json({ pageViews: mem.pageViews, writes: mem.writes, db: false });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Manejar todas las demás rutas para el SPA de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Asado Central Server running on port ${PORT}`));
