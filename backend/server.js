require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const authRoutes     = require('./routes/auth');
const classRoutes    = require('./routes/classes');
const messageRoutes  = require('./routes/messages');
const templateRoutes = require('./routes/templates');
const adminRoutes    = require('./routes/admin');
const whatsappRoutes = require('./routes/whatsapp');
const { initWhatsApp } = require('./utils/whatsapp');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/classes',   classRoutes);
app.use('/api/messages',  messageRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/whatsapp',  whatsappRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  initWhatsApp(); // Start WhatsApp client
});
