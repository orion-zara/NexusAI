import { useState, useRef, useEffect, useCallback } from "react";
import { marked } from "https://cdn.jsdelivr.net/npm/marked@12.0.2/+esm";

// ─── API ────────────────────────────────────────────────────────────────────

const API_KEY = import { useState, useRef, useEffect, useCallback } from "react";
import { marked } from "https://cdn.jsdelivr.net/npm/marked@12.0.2/+esm";

// ─── API ────────────────────────────────────────────────────────────────────

const API_KEY = "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";
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_MSG = {
  role: "system",
  content:
    "You are Nexus, a highly advanced, professional AI assistant. NEVER mention Groq, Meta, Llama, or any underlying model or provider. Respond in clean Markdown. Always label code blocks with their language. Be accurate, concise, and expert in tone.",
};

async function callGroq(history) {
  let delay = 2000;
  for (let i = 0; i < 3; i++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        messages: [SYSTEM_MSG, ...history],
      }),
    });

    if (res.status === 429) {
      if (i === 2) throw new Error("Rate limit reached. Wait a moment and try again.");
      await new Promise((r) => setTimeout(r, delay));
      delay *= 3;
      continue;
    }

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from API.");
    return text;
  }
}

// ─── MARKDOWN ───────────────────────────────────────────────────────────────

function renderMd(text) {
  const renderer = new marked.Renderer();
  renderer.code = (code, lang) => {
    const safe = (code || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const label = lang || "text";
    const enc = encodeURIComponent(code || "");
    return `<div class="nx-code-block">
      <div class="nx-code-header">
        <span class="nx-code-lang">${label}</span>
        <button class="nx-copy-btn" data-code="${enc}" onclick="window.__nxCopy(this)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy
        </button>
      </div>
      <pre class="nx-code-pre"><code>${safe}</code></pre>
    </div>`;
  };
  marked.setOptions({ renderer, breaks: true, gfm: true });
  return marked.parse(text);
}

if (typeof window !== "undefined") {
  window.__nxCopy = (btn) => {
    const text = decodeURIComponent(btn.getAttribute("data-code"));
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = "✓ Copied";
      btn.style.color = "#4ade80";
      setTimeout(() => { btn.innerHTML = orig; btn.style.color = ""; }, 2000);
    });
  };
}

// ─── ICONS ──────────────────────────────────────────────────────────────────

const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f8f7f4; --surface: #ffffff; --surface2: #f1efe9; --border: #e5e2d9;
    --text: #1a1814; --text2: #6b6760; --text3: #9b9894;
    --accent: #c96442; --accent2: #e07a56; --accent-bg: rgba(201,100,66,0.08);
    --code-bg: #1c1a17; --code-header: #151310; --code-border: #2e2b26;
    --font: 'Sora', sans-serif; --mono: 'JetBrains Mono', monospace;
    --radius: 14px; --shadow: 0 2px 12px rgba(0,0,0,0.06); --shadow-lg: 0 8px 32px rgba(0,0,0,0.1);
  }
  .dark {
    --bg: #0f0e0c; --surface: #1a1814; --surface2: #211f1b; --border: #2e2b26;
    --text: #f0ece4; --text2: #9b9894; --text3: #6b6760;
    --accent: #e07a56; --accent2: #f0956e; --accent-bg: rgba(224,122,86,0.1);
    --shadow: 0 2px 12px rgba(0,0,0,0.3); --shadow-lg: 0 8px 32px rgba(0,0,0,0.4);
  }
  html, body, #root { height: 100%; font-family: var(--font); }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  .nx-app { display: flex; flex-direction: column; height: 100vh; background: var(--bg); color: var(--text); transition: background 0.3s, color 0.3s; }

  .nx-header { display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 56px; flex-shrink: 0; background: var(--surface); border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); position: relative; z-index: 10; }
  .nx-logo { display: flex; align-items: center; gap: 10px; }
  .nx-logo-icon { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
  .nx-logo-icon svg { width: 16px; height: 16px; }
  .nx-logo-name { font-size: 15px; font-weight: 600; letter-spacing: -0.02em; color: var(--text); }
  .nx-logo-badge { font-size: 9px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); background: var(--accent-bg); padding: 2px 6px; border-radius: 4px; }
  .nx-header-actions { display: flex; gap: 4px; }
  .nx-icon-btn { width: 34px; height: 34px; border-radius: 8px; border: none; background: transparent; color: var(--text2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s; }
  .nx-icon-btn:hover { background: var(--surface2); color: var(--text); }
  .nx-icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .nx-icon-btn svg { width: 16px; height: 16px; }

  .nx-chat { flex: 1; overflow-y: auto; padding: 32px 20px 160px; scroll-behavior: smooth; }
  .nx-inner { max-width: 720px; margin: 0 auto; }

  .nx-welcome { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 55vh; text-align: center; animation: nx-fade 0.5s ease forwards; }
  .nx-welcome-icon { width: 64px; height: 64px; border-radius: 18px; background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); display: flex; align-items: center; justify-content: center; color: #fff; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(201,100,66,0.3); }
  .nx-welcome-icon svg { width: 28px; height: 28px; }
  .nx-welcome h2 { font-size: 26px; font-weight: 600; letter-spacing: -0.03em; margin-bottom: 8px; }
  .nx-welcome p { font-size: 14px; color: var(--text2); max-width: 360px; line-height: 1.6; margin-bottom: 32px; }
  .nx-suggestions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 560px; }
  @media (max-width: 500px) { .nx-suggestions { grid-template-columns: 1fr; } }
  .nx-suggestion { text-align: left; padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface); cursor: pointer; transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s; font-family: var(--font); }
  .nx-suggestion:hover { border-color: var(--accent); transform: translateY(-1px); box-shadow: var(--shadow); }
  .nx-suggestion strong { display: block; font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 3px; }
  .nx-suggestion span { font-size: 12px; color: var(--text2); line-height: 1.4; }

  .nx-msg { margin-bottom: 28px; animation: nx-up 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
  .nx-msg-user { display: flex; justify-content: flex-end; }
  .nx-msg-user-bubble { background: var(--surface2); border: 1px solid var(--border); color: var(--text); padding: 12px 16px; border-radius: var(--radius); border-bottom-right-radius: 4px; max-width: 78%; font-size: 14.5px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
  .nx-msg-ai { display: flex; align-items: flex-start; gap: 12px; }
  .nx-ai-avatar { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); display: flex; align-items: center; justify-content: center; color: #fff; margin-top: 2px; }
  .nx-ai-avatar svg { width: 14px; height: 14px; }
  .nx-ai-body { flex: 1; min-width: 0; }
  .nx-ai-content { font-size: 14.5px; line-height: 1.7; text-align: left; }

  .nx-ai-content p { margin-bottom: 12px; }
  .nx-ai-content p:last-child { margin-bottom: 0; }
  .nx-ai-content h1,.nx-ai-content h2,.nx-ai-content h3 { font-weight: 600; margin: 18px 0 8px; letter-spacing: -0.02em; }
  .nx-ai-content h1 { font-size: 20px; } .nx-ai-content h2 { font-size: 17px; } .nx-ai-content h3 { font-size: 15px; }
  .nx-ai-content ul, .nx-ai-content ol { padding-left: 20px; margin-bottom: 12px; }
  .nx-ai-content li { margin-bottom: 4px; }
  .nx-ai-content strong { font-weight: 600; }
  .nx-ai-content em { font-style: italic; color: var(--text2); }
  .nx-ai-content a { color: var(--accent); text-decoration: none; }
  .nx-ai-content a:hover { text-decoration: underline; }
  .nx-ai-content code { font-family: var(--mono); font-size: 0.82em; background: var(--accent-bg); color: var(--accent); padding: 2px 5px; border-radius: 4px; }
  .nx-ai-content blockquote { border-left: 3px solid var(--accent); padding-left: 14px; color: var(--text2); margin: 12px 0; font-style: italic; }

  .nx-code-block { background: var(--code-bg); border: 1px solid var(--code-border); border-radius: 10px; overflow: hidden; margin: 14px 0; }
  .nx-code-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: var(--code-header); border-bottom: 1px solid var(--code-border); }
  .nx-code-lang { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; }
  .nx-copy-btn { display: flex; align-items: center; gap: 5px; font-size: 11px; font-family: var(--font); color: #6b7280; background: none; border: none; cursor: pointer; padding: 3px 6px; border-radius: 5px; transition: color 0.15s, background 0.15s; }
  .nx-copy-btn:hover { color: #d1d5db; background: rgba(255,255,255,0.05); }
  .nx-code-pre { padding: 14px 16px; overflow-x: auto; margin: 0; font-family: var(--mono); font-size: 13px; line-height: 1.6; color: #cdd6f4; }
  .nx-code-pre code { background: none; color: inherit; padding: 0; font-size: inherit; }

  .nx-copy-response { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text3); background: none; border: none; cursor: pointer; font-family: var(--font); padding: 4px 0; margin-top: 8px; opacity: 0; transition: opacity 0.2s, color 0.15s; }
  .nx-msg-ai:hover .nx-copy-response { opacity: 1; }
  .nx-copy-response:hover { color: var(--text2); }

  .nx-loading { display: flex; align-items: center; gap: 5px; padding: 8px 0; }
  .nx-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: nx-dot 1.4s infinite ease-in-out both; }
  .nx-dot:nth-child(1) { animation-delay: 0s; } .nx-dot:nth-child(2) { animation-delay: 0.2s; } .nx-dot:nth-child(3) { animation-delay: 0.4s; }

  .nx-error { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: var(--radius); font-size: 13.5px; color: #ef4444; margin-bottom: 20px; }
  .nx-error svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }

  .nx-dock { position: absolute; bottom: 0; left: 0; right: 0; z-index: 20; padding: 0 20px 20px; background: linear-gradient(to top, var(--bg) 70%, transparent); }
  .nx-input-wrap { max-width: 720px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; display: flex; align-items: flex-end; box-shadow: var(--shadow-lg); transition: border-color 0.2s, box-shadow 0.2s; overflow: hidden; }
  .nx-input-wrap:focus-within { border-color: var(--accent); box-shadow: var(--shadow-lg), 0 0 0 3px rgba(201,100,66,0.12); }
  .nx-textarea { flex: 1; resize: none; border: none; background: transparent; padding: 14px 16px; font-family: var(--font); font-size: 14.5px; color: var(--text); line-height: 1.6; max-height: 180px; overflow-y: auto; outline: none; }
  .nx-textarea::placeholder { color: var(--text3); }
  .nx-send-btn { margin: 8px; width: 38px; height: 38px; border-radius: 10px; background: var(--accent); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s, transform 0.1s, opacity 0.15s; flex-shrink: 0; }
  .nx-send-btn:hover:not(:disabled) { background: var(--accent2); transform: scale(1.05); }
  .nx-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .nx-send-btn svg { width: 16px; height: 16px; }
  .nx-disclaimer { text-align: center; font-size: 11px; color: var(--text3); margin-top: 10px; letter-spacing: 0.01em; }

  @keyframes nx-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes nx-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes nx-dot { 0%, 80%, 100% { transform: scale(0); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
`;

// ─── SUGGESTIONS ─────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  { label: "Explain a concept", body: "Break down quantum entanglement in simple terms" },
  { label: "Write some code", body: "Write a Python async web scraper with error handling" },
  { label: "Analyze a topic", body: "What are the key trends shaping modern UI design?" },
  { label: "Draft content", body: "Outline an essay on the ethics of artificial intelligence" },
];

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [messages, setMessages] = useState([]);
  // history uses OpenAI format: { role: "user"|"assistant", content: string }
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("nx-styles")) {
      const s = document.createElement("style");
      s.id = "nx-styles";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const send = useCallback(async (overrideText) => {
    const text = overrideText ?? textareaRef.current?.value.trim();
    if (!text || loading) return;

    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }

    setError(null);
    const newHistory = [...history, { role: "user", content: text }];
    setHistory(newHistory);
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      const reply = await callGroq(newHistory);
      setHistory((h) => [...h, { role: "assistant", content: reply }]);
      setMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch (err) {
      setError(err.message || "Nexus couldn't reach the API. Check your key or try again.");
      setHistory(history);
    } finally {
      setLoading(false);
      if (window.innerWidth > 768) textareaRef.current?.focus();
    }
  }, [history, loading]);

  const clearChat = () => {
    setMessages([]);
    setHistory([]);
    setError(null);
  };

  const copyResponse = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="nx-app">
      <header className="nx-header">
        <div className="nx-logo">
          <div className="nx-logo-icon"><IconLayers /></div>
          <span className="nx-logo-name">Nexus</span>
          <span className="nx-logo-badge">AI</span>
        </div>
        <div className="nx-header-actions">
          <button className="nx-icon-btn" onClick={clearChat} disabled={messages.length === 0} title="New chat">
            <IconPlus />
          </button>
          <button className="nx-icon-btn" onClick={() => setDark((d) => !d)} title="Toggle theme">
            {dark ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </header>

      <main className="nx-chat" ref={chatRef} style={{ position: "relative" }}>
        <div className="nx-inner">
          {messages.length === 0 ? (
            <div className="nx-welcome">
              <div className="nx-welcome-icon"><IconLayers /></div>
              <h2>How can I help you?</h2>
              <p>I'm Nexus — your advanced AI assistant. Ask me anything or pick a prompt below.</p>
              <div className="nx-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s.label} className="nx-suggestion" onClick={() => send(s.body)}>
                    <strong>{s.label}</strong>
                    <span>{s.body}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <div key={i} className="nx-msg nx-msg-user">
                    <div className="nx-msg-user-bubble">{msg.text}</div>
                  </div>
                ) : (
                  <div key={i} className="nx-msg nx-msg-ai">
                    <div className="nx-ai-avatar"><IconLayers /></div>
                    <div className="nx-ai-body">
                      <div className="nx-ai-content" dangerouslySetInnerHTML={{ __html: renderMd(msg.text) }} />
                      <button className="nx-copy-response" onClick={() => copyResponse(msg.text, i)}>
                        <IconCopy />
                        {copied === i ? "Copied!" : "Copy response"}
                      </button>
                    </div>
                  </div>
                )
              )}
              {loading && (
                <div className="nx-msg nx-msg-ai">
                  <div className="nx-ai-avatar"><IconLayers /></div>
                  <div className="nx-ai-body">
                    <div className="nx-loading">
                      <div className="nx-dot" /><div className="nx-dot" /><div className="nx-dot" />
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="nx-error">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span><strong>Error:</strong> {error}</span>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <div className="nx-dock">
        <div className="nx-input-wrap">
          <textarea
            ref={textareaRef}
            className="nx-textarea"
            rows={1}
            placeholder="Ask Nexus anything…"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button className="nx-send-btn" onClick={() => send()} disabled={loading} title="Send">
            <IconSend />
          </button>
        </div>
        <p className="nx-disclaimer">Nexus may occasionally be wrong. Verify important information.</p>
      </div>
    </div>
  );
};
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_MSG = {
  role: "system",
  content:
    "You are Nexus, a highly advanced, professional AI assistant. NEVER mention Groq, Meta, Llama, or any underlying model or provider. Respond in clean Markdown. Always label code blocks with their language. Be accurate, concise, and expert in tone.",
};

async function callGroq(history) {
  let delay = 2000;
  for (let i = 0; i < 3; i++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        messages: [SYSTEM_MSG, ...history],
      }),
    });

    if (res.status === 429) {
      if (i === 2) throw new Error("Rate limit reached. Wait a moment and try again.");
      await new Promise((r) => setTimeout(r, delay));
      delay *= 3;
      continue;
    }

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from API.");
    return text;
  }
}

// ─── MARKDOWN ───────────────────────────────────────────────────────────────

function renderMd(text) {
  const renderer = new marked.Renderer();
  renderer.code = (code, lang) => {
    const safe = (code || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const label = lang || "text";
    const enc = encodeURIComponent(code || "");
    return `<div class="nx-code-block">
      <div class="nx-code-header">
        <span class="nx-code-lang">${label}</span>
        <button class="nx-copy-btn" data-code="${enc}" onclick="window.__nxCopy(this)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy
        </button>
      </div>
      <pre class="nx-code-pre"><code>${safe}</code></pre>
    </div>`;
  };
  marked.setOptions({ renderer, breaks: true, gfm: true });
  return marked.parse(text);
}

if (typeof window !== "undefined") {
  window.__nxCopy = (btn) => {
    const text = decodeURIComponent(btn.getAttribute("data-code"));
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = "✓ Copied";
      btn.style.color = "#4ade80";
      setTimeout(() => { btn.innerHTML = orig; btn.style.color = ""; }, 2000);
    });
  };
}

// ─── ICONS ──────────────────────────────────────────────────────────────────

const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f8f7f4; --surface: #ffffff; --surface2: #f1efe9; --border: #e5e2d9;
    --text: #1a1814; --text2: #6b6760; --text3: #9b9894;
    --accent: #c96442; --accent2: #e07a56; --accent-bg: rgba(201,100,66,0.08);
    --code-bg: #1c1a17; --code-header: #151310; --code-border: #2e2b26;
    --font: 'Sora', sans-serif; --mono: 'JetBrains Mono', monospace;
    --radius: 14px; --shadow: 0 2px 12px rgba(0,0,0,0.06); --shadow-lg: 0 8px 32px rgba(0,0,0,0.1);
  }
  .dark {
    --bg: #0f0e0c; --surface: #1a1814; --surface2: #211f1b; --border: #2e2b26;
    --text: #f0ece4; --text2: #9b9894; --text3: #6b6760;
    --accent: #e07a56; --accent2: #f0956e; --accent-bg: rgba(224,122,86,0.1);
    --shadow: 0 2px 12px rgba(0,0,0,0.3); --shadow-lg: 0 8px 32px rgba(0,0,0,0.4);
  }
  html, body, #root { height: 100%; font-family: var(--font); }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  .nx-app { display: flex; flex-direction: column; height: 100vh; background: var(--bg); color: var(--text); transition: background 0.3s, color 0.3s; }

  .nx-header { display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 56px; flex-shrink: 0; background: var(--surface); border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); position: relative; z-index: 10; }
  .nx-logo { display: flex; align-items: center; gap: 10px; }
  .nx-logo-icon { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
  .nx-logo-icon svg { width: 16px; height: 16px; }
  .nx-logo-name { font-size: 15px; font-weight: 600; letter-spacing: -0.02em; color: var(--text); }
  .nx-logo-badge { font-size: 9px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); background: var(--accent-bg); padding: 2px 6px; border-radius: 4px; }
  .nx-header-actions { display: flex; gap: 4px; }
  .nx-icon-btn { width: 34px; height: 34px; border-radius: 8px; border: none; background: transparent; color: var(--text2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s; }
  .nx-icon-btn:hover { background: var(--surface2); color: var(--text); }
  .nx-icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .nx-icon-btn svg { width: 16px; height: 16px; }

  .nx-chat { flex: 1; overflow-y: auto; padding: 32px 20px 160px; scroll-behavior: smooth; }
  .nx-inner { max-width: 720px; margin: 0 auto; }

  .nx-welcome { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 55vh; text-align: center; animation: nx-fade 0.5s ease forwards; }
  .nx-welcome-icon { width: 64px; height: 64px; border-radius: 18px; background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); display: flex; align-items: center; justify-content: center; color: #fff; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(201,100,66,0.3); }
  .nx-welcome-icon svg { width: 28px; height: 28px; }
  .nx-welcome h2 { font-size: 26px; font-weight: 600; letter-spacing: -0.03em; margin-bottom: 8px; }
  .nx-welcome p { font-size: 14px; color: var(--text2); max-width: 360px; line-height: 1.6; margin-bottom: 32px; }
  .nx-suggestions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 560px; }
  @media (max-width: 500px) { .nx-suggestions { grid-template-columns: 1fr; } }
  .nx-suggestion { text-align: left; padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface); cursor: pointer; transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s; font-family: var(--font); }
  .nx-suggestion:hover { border-color: var(--accent); transform: translateY(-1px); box-shadow: var(--shadow); }
  .nx-suggestion strong { display: block; font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 3px; }
  .nx-suggestion span { font-size: 12px; color: var(--text2); line-height: 1.4; }

  .nx-msg { margin-bottom: 28px; animation: nx-up 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
  .nx-msg-user { display: flex; justify-content: flex-end; }
  .nx-msg-user-bubble { background: var(--surface2); border: 1px solid var(--border); color: var(--text); padding: 12px 16px; border-radius: var(--radius); border-bottom-right-radius: 4px; max-width: 78%; font-size: 14.5px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
  .nx-msg-ai { display: flex; align-items: flex-start; gap: 12px; }
  .nx-ai-avatar { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); display: flex; align-items: center; justify-content: center; color: #fff; margin-top: 2px; }
  .nx-ai-avatar svg { width: 14px; height: 14px; }
  .nx-ai-body { flex: 1; min-width: 0; }
  .nx-ai-content { font-size: 14.5px; line-height: 1.7; text-align: left; }

  .nx-ai-content p { margin-bottom: 12px; }
  .nx-ai-content p:last-child { margin-bottom: 0; }
  .nx-ai-content h1,.nx-ai-content h2,.nx-ai-content h3 { font-weight: 600; margin: 18px 0 8px; letter-spacing: -0.02em; }
  .nx-ai-content h1 { font-size: 20px; } .nx-ai-content h2 { font-size: 17px; } .nx-ai-content h3 { font-size: 15px; }
  .nx-ai-content ul, .nx-ai-content ol { padding-left: 20px; margin-bottom: 12px; }
  .nx-ai-content li { margin-bottom: 4px; }
  .nx-ai-content strong { font-weight: 600; }
  .nx-ai-content em { font-style: italic; color: var(--text2); }
  .nx-ai-content a { color: var(--accent); text-decoration: none; }
  .nx-ai-content a:hover { text-decoration: underline; }
  .nx-ai-content code { font-family: var(--mono); font-size: 0.82em; background: var(--accent-bg); color: var(--accent); padding: 2px 5px; border-radius: 4px; }
  .nx-ai-content blockquote { border-left: 3px solid var(--accent); padding-left: 14px; color: var(--text2); margin: 12px 0; font-style: italic; }

  .nx-code-block { background: var(--code-bg); border: 1px solid var(--code-border); border-radius: 10px; overflow: hidden; margin: 14px 0; }
  .nx-code-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: var(--code-header); border-bottom: 1px solid var(--code-border); }
  .nx-code-lang { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; }
  .nx-copy-btn { display: flex; align-items: center; gap: 5px; font-size: 11px; font-family: var(--font); color: #6b7280; background: none; border: none; cursor: pointer; padding: 3px 6px; border-radius: 5px; transition: color 0.15s, background 0.15s; }
  .nx-copy-btn:hover { color: #d1d5db; background: rgba(255,255,255,0.05); }
  .nx-code-pre { padding: 14px 16px; overflow-x: auto; margin: 0; font-family: var(--mono); font-size: 13px; line-height: 1.6; color: #cdd6f4; }
  .nx-code-pre code { background: none; color: inherit; padding: 0; font-size: inherit; }

  .nx-copy-response { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text3); background: none; border: none; cursor: pointer; font-family: var(--font); padding: 4px 0; margin-top: 8px; opacity: 0; transition: opacity 0.2s, color 0.15s; }
  .nx-msg-ai:hover .nx-copy-response { opacity: 1; }
  .nx-copy-response:hover { color: var(--text2); }

  .nx-loading { display: flex; align-items: center; gap: 5px; padding: 8px 0; }
  .nx-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: nx-dot 1.4s infinite ease-in-out both; }
  .nx-dot:nth-child(1) { animation-delay: 0s; } .nx-dot:nth-child(2) { animation-delay: 0.2s; } .nx-dot:nth-child(3) { animation-delay: 0.4s; }

  .nx-error { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: var(--radius); font-size: 13.5px; color: #ef4444; margin-bottom: 20px; }
  .nx-error svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }

  .nx-dock { position: absolute; bottom: 0; left: 0; right: 0; z-index: 20; padding: 0 20px 20px; background: linear-gradient(to top, var(--bg) 70%, transparent); }
  .nx-input-wrap { max-width: 720px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; display: flex; align-items: flex-end; box-shadow: var(--shadow-lg); transition: border-color 0.2s, box-shadow 0.2s; overflow: hidden; }
  .nx-input-wrap:focus-within { border-color: var(--accent); box-shadow: var(--shadow-lg), 0 0 0 3px rgba(201,100,66,0.12); }
  .nx-textarea { flex: 1; resize: none; border: none; background: transparent; padding: 14px 16px; font-family: var(--font); font-size: 14.5px; color: var(--text); line-height: 1.6; max-height: 180px; overflow-y: auto; outline: none; }
  .nx-textarea::placeholder { color: var(--text3); }
  .nx-send-btn { margin: 8px; width: 38px; height: 38px; border-radius: 10px; background: var(--accent); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s, transform 0.1s, opacity 0.15s; flex-shrink: 0; }
  .nx-send-btn:hover:not(:disabled) { background: var(--accent2); transform: scale(1.05); }
  .nx-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .nx-send-btn svg { width: 16px; height: 16px; }
  .nx-disclaimer { text-align: center; font-size: 11px; color: var(--text3); margin-top: 10px; letter-spacing: 0.01em; }

  @keyframes nx-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes nx-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes nx-dot { 0%, 80%, 100% { transform: scale(0); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
`;

// ─── SUGGESTIONS ─────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  { label: "Explain a concept", body: "Break down quantum entanglement in simple terms" },
  { label: "Write some code", body: "Write a Python async web scraper with error handling" },
  { label: "Analyze a topic", body: "What are the key trends shaping modern UI design?" },
  { label: "Draft content", body: "Outline an essay on the ethics of artificial intelligence" },
];

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [messages, setMessages] = useState([]);
  // history uses OpenAI format: { role: "user"|"assistant", content: string }
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("nx-styles")) {
      const s = document.createElement("style");
      s.id = "nx-styles";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const send = useCallback(async (overrideText) => {
    const text = overrideText ?? textareaRef.current?.value.trim();
    if (!text || loading) return;

    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }

    setError(null);
    const newHistory = [...history, { role: "user", content: text }];
    setHistory(newHistory);
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      const reply = await callGroq(newHistory);
      setHistory((h) => [...h, { role: "assistant", content: reply }]);
      setMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch (err) {
      setError(err.message || "Nexus couldn't reach the API. Check your key or try again.");
      setHistory(history);
    } finally {
      setLoading(false);
      if (window.innerWidth > 768) textareaRef.current?.focus();
    }
  }, [history, loading]);

  const clearChat = () => {
    setMessages([]);
    setHistory([]);
    setError(null);
  };

  const copyResponse = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="nx-app">
      <header className="nx-header">
        <div className="nx-logo">
          <div className="nx-logo-icon"><IconLayers /></div>
          <span className="nx-logo-name">Nexus</span>
          <span className="nx-logo-badge">AI</span>
        </div>
        <div className="nx-header-actions">
          <button className="nx-icon-btn" onClick={clearChat} disabled={messages.length === 0} title="New chat">
            <IconPlus />
          </button>
          <button className="nx-icon-btn" onClick={() => setDark((d) => !d)} title="Toggle theme">
            {dark ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </header>

      <main className="nx-chat" ref={chatRef} style={{ position: "relative" }}>
        <div className="nx-inner">
          {messages.length === 0 ? (
            <div className="nx-welcome">
              <div className="nx-welcome-icon"><IconLayers /></div>
              <h2>How can I help you?</h2>
              <p>I'm Nexus — your advanced AI assistant. Ask me anything or pick a prompt below.</p>
              <div className="nx-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s.label} className="nx-suggestion" onClick={() => send(s.body)}>
                    <strong>{s.label}</strong>
                    <span>{s.body}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <div key={i} className="nx-msg nx-msg-user">
                    <div className="nx-msg-user-bubble">{msg.text}</div>
                  </div>
                ) : (
                  <div key={i} className="nx-msg nx-msg-ai">
                    <div className="nx-ai-avatar"><IconLayers /></div>
                    <div className="nx-ai-body">
                      <div className="nx-ai-content" dangerouslySetInnerHTML={{ __html: renderMd(msg.text) }} />
                      <button className="nx-copy-response" onClick={() => copyResponse(msg.text, i)}>
                        <IconCopy />
                        {copied === i ? "Copied!" : "Copy response"}
                      </button>
                    </div>
                  </div>
                )
              )}
              {loading && (
                <div className="nx-msg nx-msg-ai">
                  <div className="nx-ai-avatar"><IconLayers /></div>
                  <div className="nx-ai-body">
                    <div className="nx-loading">
                      <div className="nx-dot" /><div className="nx-dot" /><div className="nx-dot" />
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="nx-error">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span><strong>Error:</strong> {error}</span>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <div className="nx-dock">
        <div className="nx-input-wrap">
          <textarea
            ref={textareaRef}
            className="nx-textarea"
            rows={1}
            placeholder="Ask Nexus anything…"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button className="nx-send-btn" onClick={() => send()} disabled={loading} title="Send">
            <IconSend />
          </button>
        </div>
        <p className="nx-disclaimer">Nexus may occasionally be wrong. Verify important information.</p>
      </div>
    </div>
  );
}
