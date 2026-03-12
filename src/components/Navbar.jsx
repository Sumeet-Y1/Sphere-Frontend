import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { open, setOpen } = useSidebar()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [hasUnread, setHasUnread] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (message) => {
          const notification = JSON.parse(message.body)
          setNotifications(prev => [notification, ...prev])
          setHasUnread(true)
        })
      },
      reconnectDelay: 5000,
    })
    client.activate()
    return () => client.deactivate()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotifOpen = () => {
    setNotifOpen(!notifOpen)
    setHasUnread(false)
  }

  const getNotifIcon = (type) => {
    switch(type) {
      case 'DM':      return <IconDM />
      case 'COMMENT': return <IconComment />
      case 'UPVOTE':  return <IconUpvote />
      case 'FOLLOW':  return <IconFollow />
      case 'JOIN':    return <IconJoin />
      default:        return <IconBell />
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@300;400;500;600&display=swap');

        .nb-root {
          position: sticky; top: 0; z-index: 50; height: 56px;
          background: rgba(8,8,8,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
        }
        .nb-inner {
          max-width: 1280px; margin: 0 auto;
          height: 56px; padding: 0 20px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nb-left { display: flex; align-items: center; gap: 10px; }

        .nb-logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 22px;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nb-logo:hover { color: #fff; }

        .nb-hamburger {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 9px;
          background: transparent; border: none; cursor: pointer;
          color: rgba(255,255,255,0.38);
          transition: color 0.18s, background 0.18s;
        }
        .nb-hamburger:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.06); }
        .nb-hamburger.open { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.07); }

        .nb-navlink {
          position: relative;
          font-size: 13px; font-weight: 400;
          color: rgba(255,255,255,0.42);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          transition: color 0.18s, background 0.18s;
        }
        .nb-navlink:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.05); }
        .nb-navlink.active { color: rgba(255,255,255,0.9); }
        .nb-navlink.active::after {
          content: '';
          position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(255,255,255,0.6);
        }

        .nb-icon-btn {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 9px;
          color: rgba(255,255,255,0.38);
          background: transparent; border: none; cursor: pointer;
          transition: color 0.18s, background 0.18s;
        }
        .nb-icon-btn:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.06); }
        .nb-icon-btn.active { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.07); }

        .nb-unread-dot {
          position: absolute; top: 6px; right: 6px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #fff; border: 1.5px solid #080808;
        }

        .nb-notif-panel {
          position: absolute; right: 0; top: calc(100% + 8px);
          width: 320px;
          background: #0e0e0e;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7);
          overflow: hidden;
          animation: nb-dropIn 0.18s cubic-bezier(0.16,1,0.3,1) both;
        }
        .nb-notif-scroll { max-height: 360px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent; }
        .nb-notif-scroll::-webkit-scrollbar { width: 3px; }
        .nb-notif-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        .nb-notif-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; cursor: default; }
        .nb-notif-row:last-child { border-bottom: none; }
        .nb-notif-row:hover { background: rgba(255,255,255,0.03); }

        .nb-avatar-panel {
          position: absolute; right: 0; top: calc(100% + 8px);
          width: 200px;
          background: #0e0e0e;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7);
          overflow: hidden;
          animation: nb-dropIn 0.18s cubic-bezier(0.16,1,0.3,1) both;
        }
        .nb-dd-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px;
          font-size: 12.5px; font-weight: 400;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
        }
        .nb-dd-link:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.04); }
        .nb-dd-link.danger { color: rgba(239,68,68,0.7); }
        .nb-dd-link.danger:hover { color: #f87171; background: rgba(239,68,68,0.05); }

        @keyframes nb-dropIn { from { opacity:0; transform:translateY(-6px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
      `}</style>

      <nav className="nb-root">
        <div className="nb-inner">

          {/* Left: hamburger + logo */}
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button className={`nb-hamburger${open ? ' open' : ''}`} onClick={() => setOpen(v => !v)} title="Menu">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <Link to="/" className="nb-logo">Sphere</Link>
          </div>

          {/* Center: nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {[['/', 'Home'], ['/communities', 'Communities'], ['/news', 'News']].map(([path, label]) => (
              <Link key={path} to={path} className={`nb-navlink${isActive(path) ? ' active' : ''}`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

            {/* DM */}
            <Link to="/dm" className={`nb-icon-btn${isActive('/dm') ? ' active' : ''}`} style={{ textDecoration: 'none' }}>
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </Link>

            {/* Notifications */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button onClick={handleNotifOpen} className={`nb-icon-btn${notifOpen ? ' active' : ''}`}>
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                {hasUnread && <span className="nb-unread-dot" />}
              </button>
              {notifOpen && (
                <div className="nb-notif-panel">
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Notifications</p>
                    {notifications.length > 0 && (
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 20 }}>
                        {notifications.length}
                      </span>
                    )}
                  </div>
                  <div className="nb-notif-scroll">
                    {notifications.length === 0 ? (
                      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(255,255,255,0.2)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                          </svg>
                        </div>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 3 }}>No notifications yet</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.12)' }}>We'll let you know when something happens</p>
                      </div>
                    ) : notifications.map((notif, index) => (
                      <div key={index} className="nb-notif-row">
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {getNotifIcon(notif.type)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.45, marginBottom: 3 }}>{notif.message}</p>
                          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
                            {notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, borderRadius: 10 }}>
                <img
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                  alt="avatar"
                  style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.12)', display: 'block' }}
                />
              </button>
              {dropdownOpen && (
                <div className="nb-avatar-panel">
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>{user?.username}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{user?.email}</p>
                  </div>
                  <div style={{ padding: '4px 0' }}>
                    <Link to={`/profile/${user?.username}`} onClick={() => setDropdownOpen(false)} className="nb-dd-link">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      Profile
                    </Link>
                    <Link to="/settings" onClick={() => setDropdownOpen(false)} className="nb-dd-link">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" strokeWidth={1.8}/></svg>
                      Settings
                    </Link>
                    <button onClick={logout} className="nb-dd-link danger" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

const IconDM      = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color:'rgba(255,255,255,0.45)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
const IconComment = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color:'rgba(255,255,255,0.45)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
const IconUpvote  = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color:'rgba(255,255,255,0.45)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 15l7-7 7 7"/></svg>
const IconFollow  = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color:'rgba(255,255,255,0.45)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
const IconJoin    = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color:'rgba(255,255,255,0.45)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
const IconBell    = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color:'rgba(255,255,255,0.45)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>