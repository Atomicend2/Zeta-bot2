import { Router } from "express";

const router = Router();

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Zeta Bot — Pair</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0a1628 100%);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: #e2e8f0;
    }
    .card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 40px 36px;
      width: 100%; max-width: 440px;
      backdrop-filter: blur(12px);
      box-shadow: 0 24px 60px rgba(0,0,0,0.5);
    }
    .logo {
      text-align: center; margin-bottom: 28px;
    }
    .logo h1 { font-size: 2rem; font-weight: 800; letter-spacing: 2px; color: #a78bfa; }
    .logo p  { font-size: 0.85rem; color: #94a3b8; margin-top: 4px; }

    .status-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 600;
      margin-bottom: 24px;
    }
    .status-badge.connected    { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
    .status-badge.connecting   { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
    .status-badge.disconnected { background: rgba(239,68,68,0.15);  color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .dot.pulse { animation: pulse 1.4s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

    label { display: block; font-size: 0.82rem; color: #94a3b8; margin-bottom: 6px; }
    input[type=text] {
      width: 100%; padding: 12px 16px; border-radius: 10px;
      background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15);
      color: #e2e8f0; font-size: 0.95rem; outline: none;
      transition: border-color 0.2s;
    }
    input[type=text]:focus { border-color: #7c3aed; }
    input[type=text]::placeholder { color: #475569; }

    button {
      width: 100%; margin-top: 14px; padding: 13px;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border: none; border-radius: 10px; color: #fff;
      font-size: 1rem; font-weight: 700; cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
    }
    button:hover  { opacity: 0.9; }
    button:active { transform: scale(0.98); }
    button:disabled { opacity: 0.4; cursor: not-allowed; }

    .code-box {
      margin-top: 28px; padding: 24px; border-radius: 14px;
      background: rgba(124,58,237,0.15); border: 2px solid rgba(124,58,237,0.5);
      text-align: center;
    }
    .code-box .label { font-size: 0.78rem; color: #a78bfa; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; }
    .code-box .code  { font-size: 2.4rem; font-weight: 900; letter-spacing: 8px; color: #c4b5fd; font-family: monospace; }
    .code-box .hint  { font-size: 0.78rem; color: #94a3b8; margin-top: 10px; line-height: 1.5; }

    .connected-box {
      margin-top: 28px; padding: 20px; border-radius: 14px;
      background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
      text-align: center;
    }
    .connected-box .icon  { font-size: 2.5rem; }
    .connected-box .name  { font-size: 1rem; color: #4ade80; font-weight: 700; margin-top: 8px; }
    .connected-box .id    { font-size: 0.78rem; color: #94a3b8; margin-top: 4px; }

    .msg { margin-top: 12px; font-size: 0.82rem; text-align: center; color: #f87171; min-height: 18px; }
    hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0; }
    .instructions { font-size: 0.8rem; color: #64748b; line-height: 1.7; }
    .instructions ol { padding-left: 18px; }
    .instructions li { margin-bottom: 4px; }
  </style>
</head>
<body>
<div class="card">
  <div class="logo">
    <h1>⚡ ZETA</h1>
    <p>Shadow Garden Bot — Pairing Panel</p>
  </div>

  <div style="display:flex;justify-content:center;">
    <span id="statusBadge" class="status-badge disconnected">
      <span class="dot" id="dot"></span>
      <span id="statusText">Checking...</span>
    </span>
  </div>

  <div id="pairSection">
    <label for="phone">WhatsApp Number (with country code)</label>
    <input id="phone" type="text" placeholder="e.g. 2250716298719" value="" />
    <button id="startBtn" onclick="startBot()">Generate Pairing Code</button>
    <p class="msg" id="msg"></p>
  </div>

  <div id="codeSection" style="display:none">
    <div class="code-box">
      <div class="label">Enter this code in WhatsApp</div>
      <div class="code" id="pairingCode">----</div>
      <div class="hint">
        On your phone → Linked Devices → Link a Device<br/>
        → Link with phone number instead → Enter code above
      </div>
    </div>
  </div>

  <div id="connectedSection" style="display:none">
    <div class="connected-box">
      <div class="icon">✅</div>
      <div class="name" id="botName">Connected</div>
      <div class="id" id="botId"></div>
    </div>
  </div>

  <hr/>
  <div class="instructions">
    <ol>
      <li>Enter the bot's WhatsApp number above</li>
      <li>Click <strong>Generate Pairing Code</strong></li>
      <li>Open WhatsApp on that phone → <em>Linked Devices</em></li>
      <li>Tap <strong>Link a Device → Link with phone number instead</strong></li>
      <li>Type the 8-character code shown above</li>
    </ol>
  </div>
</div>

<script>
  let polling = null;

  async function startBot() {
    const phone = document.getElementById('phone').value.trim();
    if (!phone) { setMsg('Enter a phone number first'); return; }
    const btn = document.getElementById('startBtn');
    btn.disabled = true;
    setMsg('Starting...');
    try {
      const r = await fetch('/api/bot/start', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ phone })
      });
      const d = await r.json();
      if (!d.success) { setMsg(d.message || 'Error'); btn.disabled = false; return; }
      setMsg('Bot starting — waiting for pairing code...');
      startPolling();
    } catch(e) { setMsg('Network error: ' + e.message); btn.disabled = false; }
  }

  function setMsg(t) { document.getElementById('msg').textContent = t; }

  function startPolling() {
    if (polling) clearInterval(polling);
    polling = setInterval(fetchStatus, 2000);
    fetchStatus();
  }

  async function fetchStatus() {
    try {
      const r = await fetch('/api/bot/status');
      const d = await r.json();
      updateUI(d);
    } catch(e) {}
  }

  function updateUI(d) {
    const badge  = document.getElementById('statusBadge');
    const dot    = document.getElementById('dot');
    const text   = document.getElementById('statusText');
    const pairSec  = document.getElementById('pairSection');
    const codeSec  = document.getElementById('codeSection');
    const connSec  = document.getElementById('connectedSection');

    if (d.connected) {
      badge.className = 'status-badge connected';
      dot.className = 'dot'; text.textContent = 'Connected';
      pairSec.style.display = 'none'; codeSec.style.display = 'none';
      connSec.style.display = 'block';
      document.getElementById('botName').textContent = d.botName || 'Zeta';
      document.getElementById('botId').textContent = d.botId || '';
      if (polling) { clearInterval(polling); polling = null; }
    } else if (d.pairingCode) {
      badge.className = 'status-badge connecting';
      dot.className = 'dot pulse'; text.textContent = 'Awaiting pairing...';
      pairSec.style.display = 'none'; codeSec.style.display = 'block';
      connSec.style.display = 'none';
      document.getElementById('pairingCode').textContent = d.pairingCode;
    } else if (d.connecting) {
      badge.className = 'status-badge connecting';
      dot.className = 'dot pulse'; text.textContent = 'Connecting...';
    } else {
      badge.className = 'status-badge disconnected';
      dot.className = 'dot'; text.textContent = 'Disconnected';
      document.getElementById('startBtn').disabled = false;
    }
  }

  startPolling();
</script>
</body>
</html>`;

router.get("/", (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(HTML);
});

router.get("/pair", (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(HTML);
});

export { router as pairRouter };
