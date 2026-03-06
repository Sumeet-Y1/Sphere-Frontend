import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          background: rgba(8, 8, 8, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-family: 'DM Sans', sans-serif;
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .nav-logo {
          text-decoration: none;
          display: flex;
          align-items: baseline;
          gap: 2px;
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 26px;
          color: #fff;
          letter-spacing: 0.12em;
          line-height: 1;
          transition: opacity 0.2s;
        }
        .nav-logo:hover .nav-logo-text { opacity: 0.7; }

        /* Center nav links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .nav-link {
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.02em;
          color: rgba(255,255,255,0.38);
          padding: 6px 14px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          position: relative;
        }
        .nav-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }
        .nav-link.active {
          color: #fff;
          background: rgba(255,255,255,0.07);
        }
        /* Active underline dot */
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
        }

        /* Right side icons */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .icon-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s, background 0.2s;
          text-decoration: none;
        }
        .icon-btn:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }

        /* Notification dot */
        .notif-dot {
          position: absolute;
          top: 7px; right: 7px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px rgba(255,255,255,0.6);
        }

        /* Thin divider between icons and avatar */
        .nav-divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.08);
          margin: 0 6px;
          flex-shrink: 0;
        }

        /* Avatar button */
        .avatar-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 3px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          transition: opacity 0.2s;
          position: relative;
        }
        .avatar-btn:hover { opacity: 0.75; }
        .avatar-img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: block;
        }

        /* Dropdown */
        .dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          width: 200px;
          background: #0f0f0f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4);
          overflow: hidden;
          animation: dropdownIn 0.18s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dropdown-header {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .dropdown-username {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          letter-spacing: 0.01em;
        }
        .dropdown-email {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-body { padding: 6px; }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          text-align: left;
          letter-spacing: 0.01em;
        }
        .dropdown-item:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
        }
        .dropdown-item.danger { color: rgba(220,80,80,0.7); }
        .dropdown-item.danger:hover {
          color: rgba(255,100,100,0.95);
          background: rgba(255,60,60,0.06);
        }

        .dropdown-sep {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 4px 6px;
        }

        /* SVG icon size */
        .icon-svg { width: 18px; height: 18px; }
        .item-icon { width: 15px; height: 15px; opacity: 0.7; flex-shrink: 0; }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">

          {/* LEFT — Logo */}
          <Link to="/" className="nav-logo">
            <span className="nav-logo-text">Sphere</span>
          </Link>

          {/* CENTER — Nav links */}
          <div className="nav-links">
            <Link to="/"            className={`nav-link${isActive('/')            ? ' active' : ''}`}>Home</Link>
            <Link to="/communities" className={`nav-link${isActive('/communities') ? ' active' : ''}`}>Communities</Link>
            <Link to="/news"        className={`nav-link${isActive('/news')        ? ' active' : ''}`}>News</Link>
          </div>

          {/* RIGHT — Icons + avatar */}
          <div className="nav-right">

            {/* DM */}
            <Link to="/dm" className="icon-btn" title="Messages">
              <svg className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </Link>

            {/* Notifications */}
            <button className="icon-btn" title="Notifications">
              <svg className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="notif-dot" />
            </button>

            <div className="nav-divider" />

            {/* Avatar + dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button className="avatar-btn" onClick={() => setDropdownOpen(o => !o)}>
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                  alt="avatar"
                  className="avatar-img"
                />
              </button>

              {dropdownOpen && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-username">{user?.username}</div>
                    <div className="dropdown-email">{user?.email}</div>
                  </div>
                  <div className="dropdown-body">
                    <Link
                      to={`/profile/${user?.username}`}
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    <div className="dropdown-sep" />
                    <button className="dropdown-item danger" onClick={logout}>
                      <svg className="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
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