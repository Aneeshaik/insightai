// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/uploadRoute.js';
import chatRouter from './routes/chatRoute.js';

dotenv.config();

const app = express();

// ---- Middleware (only once!) ----
app.use(cors());
app.use(express.json({ limit: '5mb' }));   // protect against huge payloads

// ---- Routes ----
app.use('/upload', uploadRouter);
app.use('/chat',   chatRouter);

app.get('/', (req, res) => {
  console.log('Paper brain backend – root hit');
  res.json({ message: 'Paper Brain backend is up!' });
});

// ---- Global error handler (very useful on Vercel) ----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 for anything else
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ---- Export for Vercel (no app.listen!) ----
module.exports = app;