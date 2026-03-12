import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSidebar } from '../context/SidebarContext'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const communityColor = (name = '') => {
  const colors = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#06b6d4']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const { open, setOpen } = useSidebar()
  const [communities, setCommunities] = useState([])
  const [posts, setPosts] = useState([])
  const sidebarRef = useRef(null)

  useEffect(() => {
    api.get('/communities').then(r => setCommunities(r.data)).catch(() => {})
    api.get('/posts').then(r => setPosts(r.data)).catch(() => {})
  }, [])

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // close on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  const joinedCommunities = communities.filter(c => c.joined)
  const myPostCount = posts.filter(p => p.authorUsername === user?.username).length

  const navLinks = [
    { to: '/', label: 'Home', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
    { to: '/communities', label: 'Communities', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
    { to: '/news', label: 'News', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg> },
    { to: '/dm', label: 'Messages', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> },
    { to: `/profile/${user?.username}`, label: 'Profile', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
    { to: '/settings', label: 'Settings', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" strokeWidth={1.8}/></svg> },
    { to: '/create-post', label: 'Create Post', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4"/></svg> },
  ]

  return (
    <>
      <style>{`
        @keyframes sb-slideIn { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }

        .sb-overlay {
          position: fixed; inset: 0; top: 56px;
          background: rgba(0,0,0,0.55);
          z-index: 100;
          opacity: 0; pointer-events: none;
          transition: opacity 0.22s;
        }
        .sb-overlay.open { opacity: 1; pointer-events: all; }

        .sb-drawer {
          position: fixed; top: 56px; left: 0; bottom: 0;
          width: 264px;
          background: #0c0c0c;
          border-right: 1px solid rgba(255,255,255,0.07);
          z-index: 101;
          overflow-y: auto; overflow-x: hidden;
          scrollbar-width: none;
          transform: translateX(-100%);
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          font-family: 'DM Sans', sans-serif;
        }
        .sb-drawer::-webkit-scrollbar { display: none; }
        .sb-drawer.open { transform: translateX(0); }
        .sb-pad { padding: 14px 12px 32px; }

        .sb-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .sb-logo { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:300; color:rgba(255,255,255,0.6); letter-spacing:0.14em; }
        .sb-x { width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:7px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); color:rgba(255,255,255,0.4); cursor:pointer; transition:background 0.15s,color 0.15s; }
        .sb-x:hover { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.85); }

        .sb-user { display:flex; align-items:center; gap:10px; padding:12px; border-radius:11px; background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); margin-bottom:10px; }
        .sb-user img { width:34px; height:34px; border-radius:50%; border:1px solid rgba(255,255,255,0.12); flex-shrink:0; object-fit:cover; }

        .sb-wgt { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:12px; margin-bottom:10px; overflow:hidden; }
        .sb-wgt-hdr { padding:8px 12px 6px; border-bottom:1px solid rgba(255,255,255,0.05); font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.22); }
        .sb-wgt-bd { padding:6px 10px 10px; }

        .sb-nl { display:flex; align-items:center; gap:11px; padding:9px 10px; border-radius:9px; text-decoration:none; font-size:13px; color:rgba(255,255,255,0.4); transition:background 0.15s,color 0.15s; margin-bottom:2px; }
        .sb-nl:hover { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.85); }
        .sb-nl.active { background:rgba(255,255,255,0.08); color:#fff; }

        .sb-srow { display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
        .sb-srow:last-child { border-bottom:none; }

        .sb-cr { display:flex; align-items:center; gap:8px; padding:6px 0; text-decoration:none; border-bottom:1px solid rgba(255,255,255,0.04); transition:opacity 0.15s; }
        .sb-cr:last-child { border-bottom:none; }
        .sb-cr:hover { opacity:0.65; }
        .sb-cdot { width:22px; height:22px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:#fff; flex-shrink:0; }

        .sb-foot { padding:14px 10px 8px; border-top:1px solid rgba(255,255,255,0.05); margin-top:4px; }
        .sb-foot-links { display:flex; flex-wrap:wrap; gap:5px 9px; margin-bottom:8px; }
        .sb-foot-link { font-size:11px; color:rgba(255,255,255,0.2); text-decoration:none; transition:color 0.15s; }
        .sb-foot-link:hover { color:rgba(255,255,255,0.5); }
      `}</style>

      {/* Overlay */}
      <div className={`sb-overlay${open ? ' open' : ''}`} onClick={() => setOpen(false)} />

      {/* Drawer */}
      <div ref={sidebarRef} className={`sb-drawer${open ? ' open' : ''}`}>
        <div className="sb-pad">

          {/* Header */}
          <div className="sb-head">
            <p className="sb-logo">Sphere</p>
            <button className="sb-x" onClick={() => setOpen(false)}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* User card */}
          <div className="sb-user">
            <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="" />
            <div style={{ minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.82)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.username}</p>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:1 }}>Sphere member</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="sb-wgt">
            <div className="sb-wgt-bd" style={{ paddingTop:6, paddingBottom:6 }}>
              {navLinks.map(({ to, label, icon }) => {
                const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
                return (
                  <Link key={to} to={to} className={`sb-nl${isActive ? ' active' : ''}`}>
                    {icon}{label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="sb-wgt">
            <div className="sb-wgt-hdr">Your Stats</div>
            <div className="sb-wgt-bd">
              <div className="sb-srow">
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.28)' }}>My posts</span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{myPostCount}</span>
              </div>
              <div className="sb-srow">
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.28)' }}>Communities joined</span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{joinedCommunities.length}</span>
              </div>
            </div>
          </div>

          {/* Joined communities */}
          {joinedCommunities.length > 0 && (
            <div className="sb-wgt">
              <div className="sb-wgt-hdr">Your Communities</div>
              <div className="sb-wgt-bd">
                {joinedCommunities.slice(0, 8).map(c => (
                  <Link key={c.id} to={`/community/${c.name}`} className="sb-cr">
                    <div className="sb-cdot" style={{ background: communityColor(c.name) }}>{c.name.charAt(0).toUpperCase()}</div>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.55)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', flex:1 }}>s/{c.name}</span>
                  </Link>
                ))}
                {joinedCommunities.length > 8 && (
                  <Link to="/communities" style={{ display:'block', textAlign:'center', marginTop:8, fontSize:11, color:'rgba(255,255,255,0.2)', textDecoration:'none' }}>
                    +{joinedCommunities.length - 8} more →
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="sb-foot">
            <div className="sb-foot-links">


<Link to="/about" className="sb-foot-link">About</Link>
{['Help','Careers','Privacy','Terms'].map(l => <a key={l} href="#" className="sb-foot-link">{l}</a>)}          
          
            </div>
            <p style={{ fontSize:10, color:'rgba(255,255,255,0.1)' }}>Sphere © 2026. All rights reserved.</p>
          </div>

        </div>
      </div>
    </>
  )
}