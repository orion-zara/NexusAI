import { useState, useRef, useEffect, useCallback } from "react";
import { marked } from "marked";

// ─── API ────────────────────────────────────────────────────────────────────

const API_KEY = "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";
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_MSG = {
  role: "system",
  content:
    "You are Nexus, a highly advanced AI assistant. Respond in clean Markdown. Always label code blocks with their language.",
};

async function callGroq(history) {
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

  if (!res.ok) throw new Error("API error");

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "No response";
}

// ─── MARKDOWN ───────────────────────────────────────────────────────────────

function renderMd(text) {
  return marked.parse(text || "");
}

// ─── APP ────────────────────────────────────────────────────────────────────

export default function App() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = useCallback(async () => {
    const text = textareaRef.current.value.trim();
    if (!text || loading) return;

    textareaRef.current.value = "";

    const newHistory = [...history, { role: "user", content: text }];
    setHistory(newHistory);

    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      const reply = await callGroq(newHistory);

      setHistory((h) => [...h, { role: "assistant", content: reply }]);
      setMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "ai", text: "Error fetching response" }]);
    } finally {
      setLoading(false);
    }
  }, [history, loading]);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Nexus AI</h2>

      <div
        ref={chatRef}
        style={{
          height: "60vh",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: renderMd(msg.text),
              }}
            />
          </div>
        ))}
        {loading && <p>Typing...</p>}
      </div>

      <textarea
        ref={textareaRef}
        rows={3}
        style={{ width: "100%", marginBottom: 10 }}
        placeholder="Ask something..."
      />

      <button onClick={send} disabled={loading}>
        Send
      </button>
    </div>
  );
}
