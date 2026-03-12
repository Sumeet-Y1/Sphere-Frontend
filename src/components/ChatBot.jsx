import { useState, useRef, useEffect, useCallback } from 'react'
import api from '../api/axios'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHeaderHovered, setIsHeaderHovered] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hey! I'm Sphere AI. Ask me anything or let me summarize this page for you!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pos, setPos] = useState({ x: window.innerWidth - 88, y: window.innerHeight - 88 })
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const didDrag = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onMouseDown = useCallback((e) => {
    didDrag.current = false
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    setDragging(true)
    e.preventDefault()
  }, [pos])

  useEffect(() => {
    if (!dragging) return
    const onMouseMove = (e) => {
      didDrag.current = true
      const newX = Math.min(Math.max(e.clientX - dragOffset.current.x, 0), window.innerWidth - 64)
      const newY = Math.min(Math.max(e.clientY - dragOffset.current.y, 0), window.innerHeight - 64)
      setPos({ x: newX, y: newY })
    }
    const onMouseUp = () => setDragging(false)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [dragging])

  const sendMessage = async (text) => {
    if (!text.trim()) return
    setLoading(true)
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    try {
      const pageContent = document.body.innerText.slice(0, 2000)
      const prompt = `You are Sphere AI, a helpful assistant on a community platform called Sphere.
The user is currently viewing this page content: "${pageContent}".
Answer helpfully and concisely: ${text}`
      const res = await api.post('/ai/insight', prompt, { headers: { 'Content-Type': 'text/plain' } })
      setMessages(prev => [...prev, { role: 'assistant', text: res.data }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Something went wrong. Try again!" }])
    } finally {
      setLoading(false)
    }
  }

  const handleSummarize = async () => {
    const pageContent = document.body.innerText.slice(0, 3000)
    setIsOpen(true)
    sendMessage(`Summarize this page for me: ${pageContent}`)
  }

  const handleFabClick = () => {
    if (didDrag.current) return
    setIsOpen(!isOpen)
  }

  const windowX = Math.min(Math.max(pos.x - 280, 8), window.innerWidth - 328)
  const windowY = Math.min(Math.max(pos.y - 460, 8), window.innerHeight - 460)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes cb-slideUp { from{opacity:0;transform:translateY(12px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes cb-fadeIn  { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cb-bounce1 { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes cb-bounce2 { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes cb-bounce3 { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }

        .cb-window {
          position: fixed;
          width: 320px; height: 440px;
          display: flex; flex-direction: column;
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03);
          overflow: visible;
          animation: cb-slideUp 0.22s cubic-bezier(0.16,1,0.3,1) both;
          font-family: 'DM Sans', sans-serif;
          z-index: 9998;
        }

        /* browser tab style header */
        .cb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          height: 44px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px 20px 0 0;
          flex-shrink: 0;
          position: relative;
          cursor: default;
        }

        .cb-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 100%;
          flex: 1;
        }

        .cb-avatar {
          width: 24px; height: 24px; border-radius: 7px;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .cb-tab-title {
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          font-family: 'DM Sans', sans-serif;
          user-select: none;
        }

        .cb-tab-status {
          font-size: 10px;
          color: #22c55e;
          font-family: 'DM Sans', sans-serif;
          user-select: none;
        }

        .cb-tab-status.thinking {
          color: rgba(255,255,255,0.35);
        }

        /* THE BROWSER TAB X BUTTON */
        .cb-tab-close {
          width: 18px; height: 18px;
          border-radius: 50%;
          border: none;
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          opacity: 1;
          transition: background 0.15s;
          flex-shrink: 0;
          padding: 0;
          color: rgba(255,255,255,0.45);
        }

        .cb-tab-close:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }

        .cb-tab-close:active {
          background: rgba(255,255,255,0.2);
          transform: scale(0.9);
        }

        .cb-chips { display: flex; gap: 6px; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.04); overflow-x: auto; flex-shrink: 0; scrollbar-width: none; }
        .cb-chips::-webkit-scrollbar { display: none; }
        .cb-chip {
          flex-shrink: 0; font-size: 11px; font-weight: 400;
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 4px 10px; border-radius: 20px; cursor: pointer;
          transition: all 0.15s; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .cb-chip:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.14); }

        .cb-messages { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.05) transparent; }
        .cb-messages::-webkit-scrollbar { width: 3px; }
        .cb-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 3px; }

        .cb-bubble-user {
          align-self: flex-end; max-width: 210px; padding: 8px 12px;
          background: #fff; color: #000;
          border-radius: 14px 14px 3px 14px;
          font-size: 12px; line-height: 1.5;
          animation: cb-fadeIn 0.16s cubic-bezier(0.16,1,0.3,1) both;
          font-family: 'DM Sans', sans-serif; word-break: break-word;
        }
        .cb-bubble-ai {
          align-self: flex-start; max-width: 230px; padding: 8px 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.82);
          border-radius: 14px 14px 14px 3px;
          font-size: 12px; line-height: 1.5;
          animation: cb-fadeIn 0.16s cubic-bezier(0.16,1,0.3,1) both;
          font-family: 'DM Sans', sans-serif; word-break: break-word;
        }

        .cb-typing { display: flex; align-items: center; gap: 4px; padding: 2px 0; }
        .cb-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.3); }
        .cb-dot:nth-child(1) { animation: cb-bounce1 1.2s ease-in-out infinite; }
        .cb-dot:nth-child(2) { animation: cb-bounce2 1.2s ease-in-out 0.15s infinite; }
        .cb-dot:nth-child(3) { animation: cb-bounce3 1.2s ease-in-out 0.3s infinite; }

        .cb-input-row { display: flex; gap: 8px; padding: 10px 12px; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
        .cb-input {
          flex: 1; font-size: 12px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 8px 12px;
          color: #fff; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .cb-input:focus { border-color: rgba(255,255,255,0.2); box-shadow: 0 0 0 3px rgba(255,255,255,0.04); }
        .cb-input::placeholder { color: rgba(255,255,255,0.2); }
        .cb-send {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.09); cursor: pointer; transition: all 0.18s;
        }
        .cb-send:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(255,255,255,0.12); }
        .cb-send:disabled { opacity: 0.35; cursor: not-allowed; }

        .cb-fab {
          position: fixed;
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          cursor: grab; border: none;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          transition: box-shadow 0.2s, transform 0.2s;
          z-index: 9999;
          user-select: none;
        }
        .cb-fab:active { cursor: grabbing; }
        .cb-fab:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.7); }
      `}</style>

      {/* Chat Window */}
      {isOpen && (
        <div className="cb-window" style={{ left: windowX, top: windowY }}>

          {/* BROWSER TAB STYLE HEADER */}
          <div className="cb-header">
            <div className="cb-tab">
              <div className="cb-avatar">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#000">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span className="cb-tab-title">Sphere AI</span>
                <span className={`cb-tab-status ${loading ? 'thinking' : ''}`}>
                  {loading ? 'thinking...' : '● online'}
                </span>
              </div>
            </div>

            {/* X button — hidden until header hover, exactly like Chrome tab */}
            <button
              className="cb-tab-close"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="1" y1="1" x2="9" y2="9"/>
                <line x1="9" y1="1" x2="1" y2="9"/>
              </svg>
            </button>
          </div>

          <div className="cb-chips">
            <button className="cb-chip" onClick={handleSummarize}>Summarize page</button>
            <button className="cb-chip" onClick={() => sendMessage('What is this page about?')}>Explain</button>
            <button className="cb-chip" onClick={() => sendMessage('Give me key insights from this content')}>Key insights</button>
          </div>

          <div className="cb-messages">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'cb-bubble-user' : 'cb-bubble-ai'}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="cb-bubble-ai" style={{ padding: '10px 14px' }}>
                <div className="cb-typing">
                  <div className="cb-dot"/><div className="cb-dot"/><div className="cb-dot"/>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          <div className="cb-input-row">
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              className="cb-input" placeholder="Ask anything..."
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="cb-send"
              style={{ background: input.trim() ? '#fff' : 'rgba(255,255,255,0.05)', color: input.trim() ? '#000' : 'rgba(255,255,255,0.2)' }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB — only show when chat is closed */}
      {!isOpen && (
        <button
          ref={containerRef}
          className="cb-fab"
          style={{
            left: pos.x, top: pos.y,
            background: '#fff',
            border: 'none',
            cursor: dragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={onMouseDown}
          onClick={handleFabClick}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#000">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </button>
      )}
    </>
  )
}