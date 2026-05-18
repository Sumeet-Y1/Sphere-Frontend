import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { GOOGLE_OAUTH_URL } from '../../config/endpoints'

const videos = ['/video1.mp4', '/video2.mp4']

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const videoRef = useRef(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('banned') === 'true') {
      setError('banned')
    }
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.src = videos[currentVideo]
    vid.load()
    vid.play()
  }, [currentVideo])

  const handleEnded = () => {
    setTransitioning(true)
    setTimeout(() => { setCurrentVideo(p => (p + 1) % videos.length); setTransitioning(false) }, 600)
  }

  const switchVideo = (i) => {
    if (i === currentVideo) return
    setTransitioning(true)
    setTimeout(() => { setCurrentVideo(i); setTransitioning(false) }, 400)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, {
        username: res.data.username, email: res.data.email,
        role: res.data.role, avatarUrl: res.data.avatarUrl,
        authProvider: res.data.authProvider,
        theme: res.data.theme
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const formContent = (
    <div style={{ width: '100%', maxWidth: '340px', position: 'relative', zIndex: 1 }}>

      {/* Logo */}
      <div className="anim-1" style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '52px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '48px' : '56px', fontWeight: 300, color: '#fff', letterSpacing: '0.16em', lineHeight: 1 }}>Sphere</h1>
        <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,0.18)', margin: '16px auto 13px' }} />
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '9.5px', letterSpacing: '0.26em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>Your world, your communities</p>
      </div>

      {/* Welcome */}
      <div className="anim-2" style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.02em', fontFamily: "'DM Sans', sans-serif" }}>Welcome back</h2>
        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '13px', marginTop: '8px', fontFamily: "'DM Sans', sans-serif" }}>Sign in to continue</p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(255,60,60,0.08)',
          border: '1px solid rgba(255,80,80,0.25)',
          color: 'rgba(255,200,200,0.9)',
          padding: '12px 15px', borderRadius: '10px',
          marginBottom: '18px', fontSize: '13px',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.6
        }}>
          {error === 'banned' ? (
            <>
              <p style={{ fontWeight: 500, marginBottom: '4px' }}>🚫 Your account has been banned.</p>
              <p style={{ color: 'rgba(255,200,200,0.6)', fontSize: '12px' }}>
                If you believe this is a mistake, please contact our support team at{' '}
                <a href="mailto:support@sphere.com" style={{ color: 'rgba(255,200,200,0.9)', textDecoration: 'underline' }}>
                  support@sphere.com
                </a>{' '}
                to appeal your ban.
              </p>
            </>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}> {error}</span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="anim-3">
          <label className="field-label">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="glass-input" placeholder="you@example.com" required />
        </div>

        <div className="anim-4">
          <label className="field-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className="glass-input" style={{ paddingRight: '44px' }} placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn">
              {showPassword ? (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
          <div style={{ textAlign: 'right', marginTop: '8px' }}>
            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>
        </div>

        <div className="anim-5" style={{ paddingTop: '6px' }}>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.75 }} />
                </svg>
                Signing in...
              </span>
            ) : 'Sign In →'}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="anim-6" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em' }}>or</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Google */}
      <div className="anim-6">
        <a href={GOOGLE_OAUTH_URL} className="btn-google">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </a>
      </div>

      {/* Register link */}
      <p className="anim-7" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', textAlign: 'center', marginTop: '24px', fontFamily: "'DM Sans', sans-serif" }}>
        Don't have an account?{' '}
        <Link to="/register" className="create-link">Create one free →</Link>
      </p>

    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { from{left:-100%} to{left:150%} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideUpFade { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .anim-1{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both}
        .anim-2{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.22s both}
        .anim-3{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.36s both}
        .anim-4{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.48s both}
        .anim-5{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.58s both}
        .anim-6{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.68s both}
        .anim-7{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.76s both}
        .caption-anim{animation:slideUpFade 1.2s cubic-bezier(0.16,1,0.3,1) 0.6s both}
        .video-fade{transition:opacity 0.6s ease}
        .video-fade.out{opacity:0}

        .glass-input {
          width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
          color:#fff; padding:14px 16px; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-size:14px; outline:none;
          transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
        }
        .glass-input::placeholder{color:rgba(255,255,255,0.18)}
        .glass-input:hover{border-color:rgba(255,255,255,0.22)}
        .glass-input:focus{border-color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.07);box-shadow:0 0 0 3px rgba(255,255,255,0.05)}

        .btn-primary {
          width:100%; background:#fff; color:#000;
          font-family:'DM Sans',sans-serif; font-weight:500; font-size:14px;
          letter-spacing:0.05em; padding:15px; border-radius:10px; border:none;
          cursor:pointer; position:relative; overflow:hidden;
          transition:transform 0.2s,box-shadow 0.25s;
        }
        .btn-primary::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(0,0,0,0.07),transparent)}
        .btn-primary:hover::before{animation:shimmer 0.55s ease forwards}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(255,255,255,0.2)}
        .btn-primary:active{transform:translateY(0);box-shadow:none}
        .btn-primary:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none}

        .btn-google {
          width:100%; display:flex; align-items:center; justify-content:center; gap:10px;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
          color:rgba(255,255,255,0.7); font-family:'DM Sans',sans-serif; font-size:14px;
          padding:13px; border-radius:10px; text-decoration:none;
          transition:background 0.2s,border-color 0.2s,color 0.2s,transform 0.2s;
        }
        .btn-google:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.18);color:#fff;transform:translateY(-1px)}

        .dot{height:2px;border-radius:99px;background:rgba(255,255,255,0.28);cursor:pointer;transition:width 0.4s,background 0.4s;width:16px}
        .dot.active{background:rgba(255,255,255,0.85);width:32px}

        .field-label{display:block;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:9px}

        .create-link{color:#fff;font-weight:500;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:1px;transition:opacity 0.2s;font-family:'DM Sans',sans-serif}
        .create-link:hover{opacity:0.55}

        .forgot-link{color:rgba(255,255,255,0.3);font-size:12px;text-decoration:none;font-family:'DM Sans',sans-serif;transition:color 0.2s}
        .forgot-link:hover{color:rgba(255,255,255,0.7)}

        .eye-btn{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.25);transition:color 0.2s;padding:0;display:flex}
        .eye-btn:hover{color:rgba(255,255,255,0.75)}

        .login-footer{
          position:absolute; bottom:0; left:0; right:0;
          padding:14px 24px;
          display:flex; flex-direction:column; align-items:center; gap:6px;
          border-top:1px solid rgba(255,255,255,0.04);
        }
        .login-footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 14px}
        .login-footer-link{color:rgba(255,255,255,0.22);font-size:11px;text-decoration:none;font-family:'DM Sans',sans-serif;transition:color 0.2s}
        .login-footer-link:hover{color:rgba(255,255,255,0.6)}
        .login-footer-copy{color:rgba(255,255,255,0.1);font-size:10px;font-family:'DM Sans',sans-serif}
      `}</style>

      {isMobile ? (
        /* ── MOBILE LAYOUT ── */
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#080808' }}>
          <video
            ref={videoRef} autoPlay muted playsInline onEnded={handleEnded}
            className={`video-fade${transitioning ? ' out' : ''}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)', zIndex: 1 }} />
          <div className="caption-anim" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 3, display: 'flex', gap: 7 }}>
            {videos.map((_, i) => (
              <div key={i} className={`dot${i === currentVideo ? ' active' : ''}`} onClick={() => switchVideo(i)} />
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 28px 100px', overflowY: 'auto' }}>
            {formContent}
          </div>
          <div className="login-footer" style={{ zIndex: 3 }}>
            <div className="login-footer-links">
              <Link to="/about" className="login-footer-link">About</Link>
              <Link to="/help" className="login-footer-link">Help</Link>
              <Link to="/privacy" className="login-footer-link">Privacy</Link>
              <Link to="/legal" className="login-footer-link">Terms</Link>
            </div>
            <p className="login-footer-copy">Sphere, Inc © {new Date().getFullYear()}</p>
          </div>
        </div>

      ) : (
        /* ── DESKTOP LAYOUT ── */
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#080808', overflow: 'hidden' }}>
          <div style={{ position: 'relative', width: '62%', height: '100%', flexShrink: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '12%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)', zIndex: 3, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, transparent 100%)', zIndex: 3, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 40%, rgba(8,8,8,0.5) 70%, rgba(8,8,8,1) 100%)', zIndex: 4, pointerEvents: 'none' }} />
            <video
              ref={videoRef} autoPlay muted playsInline onEnded={handleEnded}
              className={`video-fade${transitioning ? ' out' : ''}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div className="caption-anim" style={{ position: 'absolute', bottom: '38px', left: '36px', zIndex: 10 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: '15px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', marginBottom: '14px', lineHeight: 1.5 }}>
                Every community has a story.
              </p>
              <div style={{ display: 'flex', gap: 7 }}>
                {videos.map((_, i) => (
                  <div key={i} className={`dot${i === currentVideo ? ' active' : ''}`} onClick={() => switchVideo(i)} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 44px 60px', background: '#080808', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -55%)', pointerEvents: 'none' }} />
            {[260, 180, 110].map((size, i) => (
              <div key={i} style={{ position: 'absolute', top: `${-size/2.2}px`, right: `${-size/2.2}px`, width: `${size}px`, height: `${size}px`, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
            ))}
            {formContent}
            <div className="login-footer">
              <div className="login-footer-links">
                <Link to="/about" className="login-footer-link">About</Link>
                <Link to="/help" className="login-footer-link">Help</Link>
                <Link to="/privacy" className="login-footer-link">Privacy</Link>
                <Link to="/legal" className="login-footer-link">Terms</Link>
                <a href="#" className="login-footer-link">Careers</a>
                <a href="#" className="login-footer-link">Blog</a>
              </div>
              <p className="login-footer-copy">Sphere, Inc © {new Date().getFullYear()}. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
