require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes      = require('./routes/auth');
const classRoutes     = require('./routes/classes');
const messageRoutes   = require('./routes/messages');
const templateRoutes  = require('./routes/templates');
const adminRoutes     = require('./routes/admin');
const whatsappRoutes  = require('./routes/whatsapp');

const app = express();

// ── Security & parsing ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/classes',   classRoutes);
app.use('/api/messages',  messageRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/whatsapp',  whatsappRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── DB + Start ────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 3001, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 3001}`)
    );
  })
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });
