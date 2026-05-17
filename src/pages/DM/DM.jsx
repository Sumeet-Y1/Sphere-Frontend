import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { WEBSOCKET_URL } from '../../config/endpoints'

export default function DM() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newDmUsername, setNewDmUsername] = useState('')
  const [showNewDm, setShowNewDm] = useState(false)
  const [dmError, setDmError] = useState('')
  const messagesEndRef = useRef(null)
  const stompClientRef = useRef(null)
  const selectedConvRef = useRef(null)

  useEffect(() => {
    selectedConvRef.current = selectedConv
  }, [selectedConv])

  useEffect(() => {
    fetchConversations()

    const token = localStorage.getItem('token')
    const client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        client.subscribe('/user/queue/messages', (message) => {
          const received = JSON.parse(message.body)
          if (selectedConvRef.current?.id === received.conversationId) {
            setMessages(prev => [...prev, received])
          }
          fetchConversations()
        })
      },
      reconnectDelay: 5000,
    })
    client.activate()
    stompClientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [])

  useEffect(() => {
    if (selectedConv) fetchMessages(selectedConv.id)
  }, [selectedConv])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/dm/conversations')
      setConversations(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (convId) => {
    try {
      const res = await api.get(`/dm/conversations/${convId}/messages`)
      setMessages(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    setSending(true)
    setDmError('')
    try {
      await api.post('/dm/send', {
        receiverUsername: selectedConv.otherUsername,
        content: newMessage
      })
      setNewMessage('')
      fetchMessages(selectedConv.id)
      fetchConversations()
    } catch (err) {
      setDmError(err.response?.data?.message || 'Failed to send message')
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const handleNewDm = async (e) => {
    e.preventDefault()
    if (!newDmUsername.trim()) return
    setDmError('')
    try {
      await api.post('/dm/send', { receiverUsername: newDmUsername, content: '👋 Hey!' })
      setShowNewDm(false)
      setNewDmUsername('')
      fetchConversations()
    } catch (err) {
      setDmError(err.response?.data?.message || 'Failed to start conversation')
      console.error(err)
    }
  }

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr)
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'now'
    if (m < 60) return `${m}m`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h`
    return `${Math.floor(h / 24)}d`
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes dm-fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes dm-msgIn  { from { opacity:0; transform:translateY(5px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes dm-spin   { to { transform: rotate(360deg) } }

        .dm-spin    { animation: dm-spin 1s linear infinite; }
        .dm-fade-up { animation: dm-fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .dm-msg-in  { animation: dm-msgIn 0.18s cubic-bezier(0.16,1,0.3,1) both; }

        .dm-conv-list { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.05) transparent; }
        .dm-conv-list::-webkit-scrollbar { width: 3px; }
        .dm-conv-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

        .dm-msg-list { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.05) transparent; }
        .dm-msg-list::-webkit-scrollbar { width: 3px; }
        .dm-msg-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

        .dm-conv-row { transition: background 0.15s; border-left: 2px solid transparent; }
        .dm-conv-row:hover { background: rgba(255,255,255,0.04); }
        .dm-conv-row.active { background: rgba(255,255,255,0.06); border-left-color: rgba(255,255,255,0.25); }

        .dm-input:focus {
          outline: none;
          border-color: rgba(255,255,255,0.2) !important;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
        }
        .dm-new-input:focus { outline: none; border-color: rgba(255,255,255,0.2) !important; }
        .dm-send-btn { transition: all 0.18s; }
        .dm-send-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(255,255,255,0.14); }
      `}</style>

      <div className="flex h-[calc(100vh-56px)] overflow-hidden"
        style={{ background: '#080808', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ══ LEFT — Conversations ══ */}
        <div className="flex flex-col flex-shrink-0 border-r border-white/[0.06]" style={{ width: 272 }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>
              Messages
            </p>
            <button
              onClick={() => setShowNewDm(!showNewDm)}
              className="flex items-center justify-center rounded-lg transition-all"
              style={{
                width: 30, height: 30,
                background: showNewDm ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: showNewDm ? '#fff' : 'rgba(255,255,255,0.38)',
              }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>

          {/* New DM form */}
          {showNewDm && (
            <div className="px-3 py-2 border-b border-white/[0.05] flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.012)' }}>
              <form onSubmit={handleNewDm} className="flex gap-2">
                <input
                  type="text"
                  value={newDmUsername}
                  onChange={(e) => setNewDmUsername(e.target.value)}
                  className="dm-new-input flex-1 text-sm rounded-lg px-3 py-2 transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#fff', fontFamily: "'DM Sans',sans-serif" }}
                  placeholder="Username..."
                  autoFocus
                />
                <button
                  type="submit"
                  className="text-xs font-semibold rounded-lg px-3 py-2 transition-all hover:opacity-80"
                  style={{ background: '#fff', color: '#000', fontFamily: "'DM Sans',sans-serif" }}
                >
                  Start
                </button>
              </form>
              {dmError && (
                <p style={{ marginTop: 8, fontSize: 11, color: 'rgba(252,165,165,0.9)' }}>
                  {dmError}
                </p>
              )}
            </div>
          )}

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto dm-conv-list">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="dm-spin" style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" style={{ opacity: 0.15 }}/>
                  <path fill="white" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.5 }}/>
                </svg>
              </div>
            ) : conversations.length === 0 ? (
              <div className="dm-fade-up text-center px-5 py-14">
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: 'rgba(255,255,255,0.05)', letterSpacing: '0.16em', marginBottom: 10 }}>Sphere</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 3 }}>No messages yet</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.12)' }}>Start a conversation!</p>
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`dm-conv-row w-full flex items-center gap-3 px-4 py-3 text-left${selectedConv?.id === conv.id ? ' active' : ''}`}
                >
                  <Link
                    to={`/profile/${conv.otherUsername}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ position: 'relative', flexShrink: 0 }}
                  >
                    <img
                      src={conv.otherAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.otherUsername}`}
                      className="rounded-full"
                      style={{ width: 38, height: 38, border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full font-bold"
                        style={{ width: 16, height: 16, fontSize: 9, background: '#fff', color: '#000' }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <Link
                        to={`/profile/${conv.otherUsername}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontSize: 13, fontWeight: 500, color: selectedConv?.id === conv.id ? '#fff' : 'rgba(255,255,255,0.72)', textDecoration: 'none' }}
                      >
                        {conv.otherUsername}
                      </Link>
                      {conv.lastMessageAt && (
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{timeAgo(conv.lastMessageAt)}</p>
                      )}
                    </div>
                    <p className="truncate" style={{ fontSize: 11, color: conv.unreadCount > 0 ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.2)' }}>
                      {conv.lastMessage || 'No messages'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ══ RIGHT — Messages ══ */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selectedConv ? (
            <div className="flex-1 flex items-center justify-center dm-fade-up">
              <div className="text-center">
                <div className="flex items-center justify-center rounded-2xl mx-auto mb-4"
                  style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 6 }}>
                  Your Messages
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', marginBottom: 18 }}>
                  Select a conversation or start a new one
                </p>
                <button
                  onClick={() => setShowNewDm(true)}
                  className="flex items-center gap-2 mx-auto transition-all"
                  style={{ padding: '8px 18px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans',sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.color='rgba(255,255,255,0.8)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='rgba(255,255,255,0.4)'; }}
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                  New Message
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
                <div className="relative">
                  <img
                    src={selectedConv.otherAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConv.otherUsername}`}
                    className="rounded-full"
                    style={{ width: 34, height: 34, border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <span className="absolute bottom-0 right-0 rounded-full"
                    style={{ width: 9, height: 9, background: '#22c55e', border: '2px solid #080808' }} />
                </div>
                <div>
                  <Link
                    to={`/profile/${selectedConv.otherUsername}`}
                    style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}
                  >
                    {selectedConv.otherUsername}
                  </Link>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>Active now</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto dm-msg-list px-5 py-4"
                style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {messages.map((msg, i) => {
                  const isMe = msg.senderUsername === user?.username
                  return (
                    <div
                      key={msg.id}
                      className={`dm-msg-in flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      style={{ animationDelay: `${Math.min(i * 0.015, 0.25)}s` }}
                    >
                      <div style={{ maxWidth: '66%' }}>
                        <div style={{
                          padding: '9px 13px',
                          borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                          fontSize: 13, lineHeight: 1.55,
                          background: isMe ? '#fff' : 'rgba(255,255,255,0.06)',
                          color: isMe ? '#000' : 'rgba(255,255,255,0.82)',
                          border: isMe ? 'none' : '1px solid rgba(255,255,255,0.08)',
                          fontFamily: "'DM Sans',sans-serif",
                          wordBreak: 'break-word',
                        }}>
                          <p>{msg.content}</p>
                          <p style={{ fontSize: 10, marginTop: 3, color: isMe ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.25)' }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/[0.06] flex-shrink-0">
                {dmError && (
                  <p style={{ marginBottom: 8, fontSize: 11, color: 'rgba(252,165,165,0.9)' }}>
                    {dmError}
                  </p>
                )}
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="dm-input flex-1 text-sm transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10, padding: '10px 14px',
                      color: '#fff', fontFamily: "'DM Sans',sans-serif",
                    }}
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="dm-send-btn flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{
                      width: 40, height: 40,
                      background: newMessage.trim() ? '#fff' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: newMessage.trim() ? '#000' : 'rgba(255,255,255,0.18)',
                      cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
