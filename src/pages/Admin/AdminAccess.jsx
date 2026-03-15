import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'

export default function AdminAccess() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const key = searchParams.get('key')
    if (!key) {
      setStatus('error')
      setMessage('No access key provided!')
      return
    }
    verifyKey(key)
  }, [])

  const verifyKey = async (key) => {
    try {
      await api.get(`/admin/access?key=${key}`)
      sessionStorage.setItem('adminKeyVerified', 'true')
      setStatus('success')
      setTimeout(() => navigate('/admin/login'), 1200)
    } catch (err) {
      setStatus('error')
      setMessage(err.response?.data?.message || 'Invalid admin key!')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes glow    { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes ringExp { from{transform:translate(-50%,-50%) scale(0.85);opacity:0.6} to{transform:translate(-50%,-50%) scale(1.15);opacity:0} }

        .aa-wrap {
          min-height: 100vh;
          background: #080808;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ambient glow */
        .aa-glow {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: glow 4s ease-in-out infinite;
        }

        /* decorative rings */
        .aa-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .aa-card {
          position: relative; z-index: 2;
          text-align: center;
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
          padding: 0 24px;
        }

        .aa-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 56px; font-weight: 300;
          color: #fff; letter-spacing: 0.18em;
          line-height: 1; margin-bottom: 10px;
        }

        .aa-divider {
          width: 32px; height: 1px;
          background: rgba(255,255,255,0.15);
          margin: 0 auto 10px;
        }

        .aa-subtitle {
          color: rgba(255,255,255,0.18);
          font-size: 9.5px; letter-spacing: 0.32em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 56px;
        }

        /* status icons */
        .aa-icon-wrap {
          width: 64px; height: 64px;
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          position: relative;
        }

        .aa-icon-ring {
          position: absolute; inset: -12px;
          border-radius: 50%;
          border: 1px solid currentColor;
          opacity: 0;
          animation: ringExp 1.8s ease-out infinite;
        }

        .aa-status-text {
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 8px;
        }

        .aa-status-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
        }

        /* progress bar for verifying */
        .aa-progress-track {
          width: 180px; height: 1px;
          background: rgba(255,255,255,0.07);
          border-radius: 99px;
          margin: 24px auto 0;
          overflow: hidden;
        }
        .aa-progress-bar {
          height: 100%;
          background: rgba(255,255,255,0.35);
          border-radius: 99px;
          animation: progressAnim 2s ease-in-out infinite;
        }
        @keyframes progressAnim {
          0%   { width:0%;   margin-left:0% }
          50%  { width:60%;  margin-left:20% }
          100% { width:0%;   margin-left:100% }
        }

        /* bottom badge */
        .aa-badge {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 99px; padding: 7px 16px;
          font-size: 10px; color: rgba(255,255,255,0.18);
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.08em; text-transform: uppercase;
          white-space: nowrap;
        }
      `}</style>

      <div className="aa-wrap">
        {/* Ambient */}
        <div className="aa-glow" />
        {[320, 220, 140].map((s, i) => (
          <div key={i} className="aa-ring" style={{ width: s, height: s }} />
        ))}

        <div className="aa-card">
          {/* Logo */}
          <div className="aa-logo">Sphere</div>
          <div className="aa-divider" />
          <div className="aa-subtitle">Admin Portal</div>

          {/* Verifying */}
          {status === 'verifying' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="aa-icon-wrap" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <svg style={{ animation: 'spin 1s linear infinite', width: 26, height: 26 }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5" style={{ opacity: 0.12 }} />
                  <path fill="white" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.55 }} />
                </svg>
              </div>
              <p className="aa-status-text" style={{ color: 'rgba(255,255,255,0.5)', animation: 'pulse 1.6s ease infinite' }}>
                Verifying access key
              </p>
              <p className="aa-status-sub">Please wait while we authenticate your request</p>
              <div className="aa-progress-track">
                <div className="aa-progress-bar" />
              </div>
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="aa-icon-wrap" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: 'rgba(34,197,94,0.5)' }}>
                <div className="aa-icon-ring" style={{ color: 'rgba(34,197,94,0.3)' }} />
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="rgba(34,197,94,0.9)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="aa-status-text" style={{ color: 'rgba(34,197,94,0.85)' }}>Key Verified</p>
              <p className="aa-status-sub">Redirecting to admin login...</p>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="aa-icon-wrap" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.5)' }}>
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="rgba(239,68,68,0.9)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="aa-status-text" style={{ color: 'rgba(239,68,68,0.85)' }}>Access Denied</p>
              <p className="aa-status-sub">{message}</p>
              <button
                onClick={() => window.history.back()}
                style={{ marginTop: 24, padding: '10px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
                onMouseOver={e => e.target.style.color='rgba(255,255,255,0.8)'}
                onMouseOut={e => e.target.style.color='rgba(255,255,255,0.4)'}
              >
                Go Back
              </button>
            </div>
          )}
        </div>

        {/* Bottom badge */}
        <div className="aa-badge">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <circle cx="4" cy="4" r="3" fill="rgba(255,255,255,0.3)" />
          </svg>
          Secured · Admin Access Only
        </div>
      </div>
    </>
  )
}