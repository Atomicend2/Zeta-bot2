import { Router } from "express";

const router = Router();

function buildHtml(defaultPhone: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Zeta Bot — Pair</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 55%, #0a1628 100%);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: #e2e8f0; padding: 20px;
    }
    .card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 22px;
      padding: 44px 40px;
      width: 100%; max-width: 460px;
      backdrop-filter: blur(14px);
      box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo h1 { font-size: 2.2rem; font-weight: 900; letter-spacing: 4px; color: #a78bfa; }
    .logo p  { font-size: 0.83rem; color: #64748b; margin-top: 6px; letter-spacing: 1px; }

    .badge-row { display: flex; justify-content: center; margin-bottom: 28px; }
    .badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 7px 16px; border-radius: 999px; font-size: 0.8rem; font-weight: 700;
      letter-spacing: 0.5px;
    }
    .badge.disconnected { background: rgba(239,68,68,0.15);  color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
    .badge.connecting   { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
    .badge.pairing      { background: rgba(124,58,237,0.2);  color: #c4b5fd; border: 1px solid rgba(124,58,237,0.5); }
    .badge.connected    { background: rgba(34,197,94,0.15);  color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
    .badge.expired      { background: rgba(239,68,68,0.12);  color: #fca5a5; border: 1px solid rgba(239,68,68,0.25); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
    .pulse { animation: blink 1.2s ease-in-out infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

    section { display: none; }
    section.visible { display: block; }

    label { display: block; font-size: 0.8rem; color: #94a3b8; margin-bottom: 7px; font-weight: 600; letter-spacing: 0.3px; }
    input[type=text] {
      width: 100%; padding: 13px 16px; border-radius: 11px;
      background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15);
      color: #f1f5f9; font-size: 1rem; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input[type=text]:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.2); }
    input[type=text]::placeholder { color: #475569; }

    .hint-text { font-size: 0.75rem; color: #475569; margin-top: 6px; }

    button {
      width: 100%; margin-top: 16px; padding: 14px;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border: none; border-radius: 11px; color: #fff;
      font-size: 0.95rem; font-weight: 800; cursor: pointer; letter-spacing: 0.5px;
      transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(124,58,237,0.4);
    }
    button:hover  { opacity: 0.88; box-shadow: 0 6px 24px rgba(124,58,237,0.5); }
    button:active { transform: scale(0.98); }
    button:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }

    .err { font-size: 0.8rem; color: #f87171; margin-top: 10px; min-height: 18px; text-align: center; }

    .code-wrap {
      margin-top: 28px; padding: 28px 24px; border-radius: 16px;
      background: rgba(124,58,237,0.12); border: 2px solid rgba(124,58,237,0.45);
      text-align: center;
    }
    .code-label { font-size: 0.72rem; color: #a78bfa; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; font-weight: 700; }
    .code-value { font-size: 2.6rem; font-weight: 900; letter-spacing: 10px; color: #ddd6fe; font-family: 'Courier New', monospace; }
    .code-timer { font-size: 0.78rem; color: #94a3b8; margin-top: 12px; }
    .code-timer span { color: #fbbf24; font-weight: 700; }

    .steps {
      margin-top: 20px; padding: 16px 18px; border-radius: 12px;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    }
    .steps p { font-size: 0.78rem; color: #64748b; line-height: 1.8; }
    .steps strong { color: #94a3b8; }

    .connected-wrap {
      margin-top: 28px; padding: 28px 24px; border-radius: 16px;
      background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25);
      text-align: center;
    }
    .connected-icon { font-size: 3rem; }
    .connected-name { font-size: 1.1rem; color: #4ade80; font-weight: 800; margin-top: 10px; }
    .connected-id   { font-size: 0.78rem; color: #64748b; margin-top: 5px; }

    .expired-wrap {
      margin-top: 28px; padding: 22px; border-radius: 14px;
      background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
      text-align: center;
    }
    .expired-wrap p { font-size: 0.85rem; color: #fca5a5; margin-bottom: 4px; }
    .expired-wrap small { font-size: 0.75rem; color: #64748b; }

    hr { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 26px 0; }
  </style>
</head>
<body>
<div class="card">
  <div class="logo">
    <h1>⚡ ZETA</h1>
    <p>SHADOW GARDEN · PAIRING PANEL</p>
  </div>

  <div class="badge-row">
    <span class="badge disconnected" id="badge">
      <span class="dot" id="badgeDot"></span>
      <span id="badgeText">Checking...</span>
    </span>
  </div>

  <section id="secForm">
    <label for="phoneInput">WhatsApp Number (with country code, no + or spaces)</label>
    <input id="phoneInput" type="text" placeholder="e.g. 2250716298719" value="${defaultPhone}" autocomplete="off" inputmode="numeric" />
    <p class="hint-text">Example: Ivory Coast +225 → 2250716298719</p>
    <button id="startBtn" onclick="startPairing()">Generate Pairing Code</button>
    <p class="err" id="errMsg"></p>
  </section>

  <section id="secCode">
    <div class="code-wrap">
      <div class="code-label">Enter this code in WhatsApp</div>
      <div class="code-value" id="codeValue">--------</div>
      <div class="code-timer">Expires in <span id="codeCountdown">120</span>s</div>
    </div>
    <div class="steps">
      <p>
        1. Open WhatsApp on <strong>the phone with this number</strong><br/>
        2. Tap <strong>Linked Devices → Link a Device</strong><br/>
        3. Tap <strong>"Link with phone number instead"</strong><br/>
        4. Enter the code above
      </p>
    </div>
  </section>

  <section id="secExpired">
    <div class="expired-wrap">
      <p>⏱️ Pairing code expired — WhatsApp did not receive it in time.</p>
      <small>Click below to generate a new code.</small>
    </div>
    <button onclick="retry()">Try Again</button>
  </section>

  <section id="secConnected">
    <div class="connected-wrap">
      <div class="connected-icon">✅</div>
      <div class="connected-name" id="connName">Zeta is connected!</div>
      <div class="connected-id" id="connId"></div>
    </div>
    <hr/>
    <p style="font-size:0.78rem;color:#475569;text-align:center;">The bot is live. You can close this page.</p>
  </section>
</div>

<script>
  var pollTimer = null;
  var countdownTimer = null;
  var countdownSecs = 120;

  function show(id) {
    ['secForm','secCode','secExpired','secConnected'].forEach(function(s){
      document.getElementById(s).className = 'section' + (s === id ? ' visible' : '');
      document.getElementById(s).style.display = s === id ? 'block' : 'none';
    });
  }

  function setBadge(cls, text, pulse) {
    var b = document.getElementById('badge');
    var d = document.getElementById('badgeDot');
    b.className = 'badge ' + cls;
    document.getElementById('badgeText').textContent = text;
    d.className = 'dot' + (pulse ? ' pulse' : '');
  }

  function setErr(msg) { document.getElementById('errMsg').textContent = msg || ''; }

  function startCountdown() {
    countdownSecs = 120;
    clearInterval(countdownTimer);
    countdownTimer = setInterval(function(){
      countdownSecs--;
      var el = document.getElementById('codeCountdown');
      if (el) el.textContent = countdownSecs;
      if (countdownSecs <= 0) clearInterval(countdownTimer);
    }, 1000);
  }

  async function startPairing() {
    var phone = document.getElementById('phoneInput').value.replace(/\\D/g, '');
    if (!phone || phone.length < 7) { setErr('Enter a valid phone number.'); return; }
    var btn = document.getElementById('startBtn');
    btn.disabled = true;
    setErr('');
    setBadge('connecting', 'Starting...', true);
    try {
      var r = await fetch('/api/bot/start', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ phone: phone })
      });
      var d = await r.json();
      if (!d.success) {
        setErr(d.message || 'Failed to start.');
        btn.disabled = false;
        setBadge('disconnected', 'Error', false);
        return;
      }
      setBadge('connecting', 'Connecting...', true);
      startPolling();
    } catch(e) {
      setErr('Network error: ' + e.message);
      btn.disabled = false;
      setBadge('disconnected', 'Error', false);
    }
  }

  function retry() {
    document.getElementById('startBtn').disabled = false;
    setErr('');
    show('secForm');
    setBadge('disconnected', 'Disconnected', false);
  }

  function startPolling() {
    clearInterval(pollTimer);
    pollTimer = setInterval(fetchStatus, 1500);
    fetchStatus();
  }

  async function fetchStatus() {
    try {
      var r = await fetch('/api/bot/status');
      var d = await r.json();
      updateUI(d);
    } catch(e) {}
  }

  function updateUI(d) {
    if (d.connected) {
      clearInterval(pollTimer);
      clearInterval(countdownTimer);
      setBadge('connected', 'Connected ✓', false);
      document.getElementById('connName').textContent = (d.botName || 'Zeta') + ' is connected!';
      document.getElementById('connId').textContent = d.botId || '';
      show('secConnected');

    } else if (d.pairingExpired) {
      clearInterval(pollTimer);
      clearInterval(countdownTimer);
      setBadge('expired', 'Code expired', false);
      show('secExpired');

    } else if (d.pairingCode) {
      setBadge('pairing', 'Awaiting code entry...', true);
      document.getElementById('codeValue').textContent = d.pairingCode;
      if (document.getElementById('secCode').style.display !== 'block') {
        show('secCode');
        startCountdown();
      }

    } else if (d.connecting) {
      setBadge('connecting', 'Connecting...', true);

    } else {
      setBadge('disconnected', 'Disconnected', false);
    }
  }

  show('secForm');
  startPolling();
</script>
</body>
</html>`;
}

router.get(["/", "/pair"], (req, res) => {
  const defaultPhone = process.env["BOT_PHONE_NUMBER"] || "";
  res.setHeader("Content-Type", "text/html");
  res.send(buildHtml(defaultPhone));
});

export { router as pairRouter };
