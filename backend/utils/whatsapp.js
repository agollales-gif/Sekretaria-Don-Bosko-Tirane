const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

let client = null;
let status = 'disconnected'; // 'disconnected' | 'qr_ready' | 'connected'
let currentQR = null;

function initWhatsApp() {
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
  });

  client.on('qr', async (qr) => {
    status = 'qr_ready';
    currentQR = await qrcode.toDataURL(qr);
    console.log('📱 QR i ri gjenerohet — skanoje me telefonin e shkollës');
  });

  client.on('ready', () => {
    status = 'connected';
    currentQR = null;
    console.log('✅ WhatsApp i lidhur');
  });

  client.on('disconnected', (reason) => {
    status = 'disconnected';
    currentQR = null;
    console.log('⚠️ WhatsApp u shkëput:', reason);
    // Auto-reconnect after 30 seconds
    setTimeout(initWhatsApp, 30000);
  });

  client.initialize().catch(err => {
    console.error('❌ WhatsApp init error:', err);
    setTimeout(initWhatsApp, 30000);
  });
}

async function sendWhatsAppMessage(phone, text) {
  if (status !== 'connected') {
    throw new Error('WHATSAPP_NOT_CONNECTED');
  }
  // Format: +355xxxxxxxx → 355xxxxxxxx@c.us
  const chatId = phone.replace(/^\+/, '') + '@c.us';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    await client.sendMessage(chatId, text);
  } finally {
    clearTimeout(timeout);
  }
}

function getStatus() { return status; }
function getQR()     { return currentQR; }

module.exports = { initWhatsApp, sendWhatsAppMessage, getStatus, getQR };
