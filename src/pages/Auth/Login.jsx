import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const videos = ['/video1.mp4', '/video2.mp4']

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const videoRef = useRef(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.src = videos[currentVideo]
    vid.load()
    vid.play()
  }, [currentVideo])

  const handleEnded = () => {
    setTransitioning(true)
    setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length)
      setTransitioning(false)
    }, 600)
  }

  const switchVideo = (i) => {
    if (i === currentVideo) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrentVideo(i)
      setTransitioning(false)
    }, 400)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, {
        username: res.data.username,
        email: res.data.email,
        role: res.data.role
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { left: -100%; }
          to   { left: 150%; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .anim-1 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .anim-2 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .anim-3 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
        .anim-4 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.48s both; }
        .anim-5 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.58s both; }
        .anim-6 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.68s both; }
        .caption-anim { animation: slideUpFade 1.2s cubic-bezier(0.16,1,0.3,1) 0.6s both; }

        .video-fade { transition: opacity 0.6s ease; }
        .video-fade.out { opacity: 0; }

        .glass-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 14px 16px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.18); }
        .glass-input:hover { border-color: rgba(255,255,255,0.22); }
        .glass-input:focus {
          border-color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.05), 0 0 24px rgba(255,255,255,0.04);
        }

        .btn-primary {
          width: 100%;
          background: #fff;
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.05em;
          padding: 15px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.25s ease;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent);
        }
        .btn-primary:hover::before { animation: shimmer 0.55s ease forwards; }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(255,255,255,0.2), 0 2px 8px rgba(255,255,255,0.1);
        }
        .btn-primary:active { transform: translateY(0); box-shadow: none; }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

        .dot {
          height: 2px;
          border-radius: 99px;
          background: rgba(255,255,255,0.28);
          cursor: pointer;
          transition: width 0.4s ease, background 0.4s ease;
          width: 16px;
        }
        .dot.active { background: rgba(255,255,255,0.85); width: 32px; }

        .field-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 9px;
        }

        .create-link {
          color: #fff;
          font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 1px;
          transition: opacity 0.2s, border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .create-link:hover { opacity: 0.55; border-color: transparent; }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.25);
          transition: color 0.2s;
          padding: 0;
          display: flex;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.75); }
      `}</style>

      <div style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: '#080808',
        overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif"
      }}>

        {/* ── LEFT: video — 62%, dominates the page ── */}
        <div style={{
          position: 'relative',
          width: '62%',
          height: '100%',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          {/* Top cinematic bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '12%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
            zIndex: 3, pointerEvents: 'none'
          }} />

          {/* Bottom fade — heavy, cinematic */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '35%',
            background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, transparent 100%)',
            zIndex: 3, pointerEvents: 'none'
          }} />

          {/* Right edge bleed — video melts into form, NO hard divider line */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, transparent 40%, rgba(8,8,8,0.5) 70%, rgba(8,8,8,1) 100%)',
            zIndex: 4, pointerEvents: 'none'
          }} />

          <video
            ref={videoRef}
            autoPlay muted playsInline
            onEnded={handleEnded}
            className={`video-fade${transitioning ? ' out' : ''}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          >
            <source src={videos[0]} type="video/mp4" />
          </video>

          {/* Cinematic caption + dots — bottom left of video */}
          <div className="caption-anim" style={{
            position: 'absolute',
            bottom: '38px',
            left: '36px',
            zIndex: 10,
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '15px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.04em',
              marginBottom: '14px',
              lineHeight: 1.5
            }}>
              Every community has a story.
            </p>
            <div style={{ display: 'flex', gap: 7 }}>
              {videos.map((_, i) => (
                <div key={i} className={`dot${i === currentVideo ? ' active' : ''}`} onClick={() => switchVideo(i)} />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: form panel — no divider, bleeds from video ── */}
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 44px',
          background: '#080808',
          overflow: 'hidden'
        }}>

          {/* Subtle ambient radial glow behind the form */}
          <div style={{
            position: 'absolute',
            width: '380px', height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -55%)',
            pointerEvents: 'none'
          }} />

          {/* Decorative concentric rings — top right corner */}
          {[260, 180, 110].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${-size / 2.2}px`, right: `${-size / 2.2}px`,
              width: `${size}px`, height: `${size}px`,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.04)',
              pointerEvents: 'none'
            }} />
          ))}

          <div style={{ width: '100%', maxWidth: '340px', position: 'relative', zIndex: 1 }}>

            {/* Logo */}
            <div className="anim-1" style={{ textAlign: 'center', marginBottom: '52px' }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '56px',
                fontWeight: 300,
                color: '#fff',
                letterSpacing: '0.16em',
                lineHeight: 1
              }}>
                Sphere
              </h1>
              {/* Thin decorative rule between logo and tagline */}
              <div style={{
                width: '28px', height: '1px',
                background: 'rgba(255,255,255,0.18)',
                margin: '16px auto 13px'
              }} />
              <p style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: '9.5px',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif"
              }}>
                Your world, your communities
              </p>
            </div>

            {/* Welcome */}
            <div className="anim-2" style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{
                color: '#fff',
                fontSize: '22px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                fontFamily: "'DM Sans', sans-serif"
              }}>
                Welcome back
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.22)',
                fontSize: '13px',
                marginTop: '8px',
                fontFamily: "'DM Sans', sans-serif"
              }}>
                Sign in to continue
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(255,60,60,0.08)',
                border: '1px solid rgba(255,80,80,0.25)',
                color: 'rgba(255,200,200,0.9)',
                padding: '11px 15px',
                borderRadius: '10px',
                marginBottom: '18px',
                fontSize: '13px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                fontFamily: "'DM Sans', sans-serif"
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div className="anim-3">
                <label className="field-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="glass-input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="anim-4">
                <label className="field-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ paddingRight: '44px' }}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-btn"
                  >
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
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

            <p className="anim-6" style={{
              color: 'rgba(255,255,255,0.2)',
              fontSize: '12px',
              textAlign: 'center',
              marginTop: '32px',
              fontFamily: "'DM Sans', sans-serif"
            }}>
              Don't have an account?{' '}
              <Link to="/register" className="create-link">
                Create one free →
              </Link>
            </p>

          </div>
        </div>

      </div>
    </>
  )
}