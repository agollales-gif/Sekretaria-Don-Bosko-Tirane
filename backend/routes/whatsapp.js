const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { getStatus, getQR, initWhatsApp } = require('../utils/whatsapp');

// GET /api/whatsapp/status
router.get('/status', verifyToken, (req, res) => {
  res.json({ connected: getStatus() === 'connected', status: getStatus() });
});

// GET /api/whatsapp/qr
router.get('/qr', verifyToken, (req, res) => {
  const status = getStatus();
  if (status === 'connected') return res.json({ status: 'connected' });
  if (status === 'qr_ready')  return res.json({ status: 'qr_ready', qr: getQR() });
  // Disconnected — trigger re-init
  initWhatsApp();
  res.json({ status: 'initializing' });
});

module.exports = router;
