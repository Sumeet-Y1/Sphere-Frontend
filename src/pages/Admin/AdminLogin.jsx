import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const videoRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const verified = sessionStorage.getItem('adminKeyVerified')
    if (!verified) navigate('/admin/access')
  }, [])

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.src = '/adminvideo.mp4'
    vid.load()
    vid.play()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/admin/login', { email, password })
      localStorage.setItem('adminToken', res.data.token)
      localStorage.setItem('adminUser', JSON.stringify({
        username: res.data.username,
        email: res.data.email,
        role: res.data.role
      }))
      sessionStorage.removeItem('adminKeyVerified')
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed!')
    } finally {
      setLoading(false)
    }
  }

  const formContent = (
    <div style={{ width: '100%', maxWidth: '340px', position: 'relative', zIndex: 1 }}>

      {/* Logo */}
      <div className="al-anim-1" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '46px' : '52px', fontWeight: 300, color: '#fff', letterSpacing: '0.18em', lineHeight: 1 }}>Sphere</h1>
        <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,0.15)', margin: '14px auto 12px' }} />
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '9.5px', letterSpacing: '0.32em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>Admin Portal</p>
      </div>

      {/* Shield icon + heading */}
      <div className="al-anim-2" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: 52, height: 52, borderRadius: '15px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.45)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', fontFamily: "'DM Sans', sans-serif" }}>Admin Access</h2>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', marginTop: '6px', fontFamily: "'DM Sans', sans-serif" }}>Enter your credentials to continue</p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,200,200,0.9)', padding: '11px 15px', borderRadius: '10px', marginBottom: '18px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="al-anim-3">
          <label className="al-label">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="al-input" placeholder="admin@sphere.com" autoFocus />
        </div>

        <div className="al-anim-4">
          <label className="al-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="al-input" placeholder="••••••••" style={{ paddingRight: '44px' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="al-eye">
              {showPassword ? (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="al-anim-5" style={{ paddingTop: '4px' }}>
          <button type="submit" disabled={loading} className="al-btn">
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.75 }} />
                </svg>
                Verifying...
              </span>
            ) : 'Access Dashboard →'}
          </button>
        </div>
      </form>

      {/* Security note */}
      <div className="al-anim-6" style={{ marginTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.2)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em' }}>
          Restricted area · Unauthorized access is prohibited
        </p>
      </div>

    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { from{left:-100%} to{left:150%} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes slideUpFade { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .al-anim-1{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both}
        .al-anim-2{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both}
        .al-anim-3{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.32s both}
        .al-anim-4{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.42s both}
        .al-anim-5{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.52s both}
        .al-anim-6{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.62s both}
        .caption-anim{animation:slideUpFade 1.2s cubic-bezier(0.16,1,0.3,1) 0.6s both}

        .al-input {
          width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
          color:#fff; padding:14px 16px; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-size:14px; outline:none;
          transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
        }
        .al-input::placeholder{color:rgba(255,255,255,0.18)}
        .al-input:hover{border-color:rgba(255,255,255,0.22)}
        .al-input:focus{border-color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.07);box-shadow:0 0 0 3px rgba(255,255,255,0.05)}

        .al-label{display:block;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:9px}

        .al-btn {
          width:100%; background:#fff; color:#000;
          font-family:'DM Sans',sans-serif; font-weight:500; font-size:14px;
          letter-spacing:0.05em; padding:15px; border-radius:10px; border:none;
          cursor:pointer; position:relative; overflow:hidden;
          transition:transform 0.2s,box-shadow 0.25s;
        }
        .al-btn::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(0,0,0,0.07),transparent)}
        .al-btn:hover::before{animation:shimmer 0.5s ease forwards}
        .al-btn:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(255,255,255,0.2)}
        .al-btn:active{transform:translateY(0);box-shadow:none}
        .al-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none}

        .al-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.25);transition:color 0.2s;padding:0;display:flex}
        .al-eye:hover{color:rgba(255,255,255,0.75)}

        .al-footer{position:absolute;bottom:0;left:0;right:0;padding:14px 24px;display:flex;flex-direction:column;align-items:center;gap:6px;border-top:1px solid rgba(255,255,255,0.04)}
        .al-footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 14px}
        .al-footer-link{color:rgba(255,255,255,0.18);font-size:11px;text-decoration:none;font-family:'DM Sans',sans-serif;transition:color 0.2s;letter-spacing:0.02em}
        .al-footer-link:hover{color:rgba(255,255,255,0.55)}
        .al-footer-copy{color:rgba(255,255,255,0.08);font-size:10px;font-family:'DM Sans',sans-serif}
      `}</style>

      {isMobile ? (
        /* ── MOBILE: video bg + glass form ── */
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#080808' }}>
          <video ref={videoRef} autoPlay muted playsInline loop
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.35) 100%)', zIndex: 1 }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 28px 100px', overflowY: 'auto' }}>
            {formContent}
          </div>
          <div className="al-footer" style={{ zIndex: 3 }}>
            <div className="al-footer-links">
              <a href="#" className="al-footer-link">Privacy</a>
              <a href="#" className="al-footer-link">Terms</a>
              <a href="#" className="al-footer-link">Help</a>
            </div>
            <p className="al-footer-copy">Sphere, Inc © {new Date().getFullYear()}</p>
          </div>
        </div>

      ) : (
        /* ── DESKTOP: split layout ── */
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#080808', overflow: 'hidden' }}>

          {/* Left: video */}
          <div style={{ position: 'relative', width: '62%', height: '100%', flexShrink: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '12%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)', zIndex: 3, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, transparent 100%)', zIndex: 3, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 40%, rgba(8,8,8,0.5) 70%, rgba(8,8,8,1) 100%)', zIndex: 4, pointerEvents: 'none' }} />
            <video ref={videoRef} autoPlay muted playsInline loop
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div className="caption-anim" style={{ position: 'absolute', bottom: '38px', left: '36px', zIndex: 10 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: '15px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', lineHeight: 1.5 }}>
                Behind every platform, a guardian.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 44px 60px', background: '#080808', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -55%)', pointerEvents: 'none' }} />
            {[260, 180, 110].map((size, i) => (
              <div key={i} style={{ position: 'absolute', top: `${-size/2.2}px`, right: `${-size/2.2}px`, width: `${size}px`, height: `${size}px`, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
            ))}
            {formContent}
            <div className="al-footer">
              <div className="al-footer-links">
                <a href="#" className="al-footer-link">Privacy</a>
                <a href="#" className="al-footer-link">Terms</a>
                <a href="#" className="al-footer-link">Help</a>
              </div>
              <p className="al-footer-copy">Sphere, Inc © {new Date().getFullYear()}. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}