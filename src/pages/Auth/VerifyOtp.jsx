import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'

export default function VerifyOtp() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/verify-otp', { email, code })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setResent(false)
    setError('')
    try {
      await api.post('/auth/resend-otp', { email })
      setResent(true)
    } catch (err) {
      setError('Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

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
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
          50%       { box-shadow: 0 0 32px 4px rgba(255,255,255,0.04); }
        }

        .anim-1 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .anim-2 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .anim-3 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.34s both; }
        .anim-4 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.44s both; }
        .anim-5 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.54s both; }
        .anim-6 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.62s both; }

        .otp-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 18px 16px;
          border-radius: 12px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 400;
          letter-spacing: 0.55em;
          text-align: center;
          text-indent: 0.55em;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .otp-input::placeholder {
          color: rgba(255,255,255,0.1);
          letter-spacing: 0.4em;
        }
        .otp-input:hover { border-color: rgba(255,255,255,0.2); }
        .otp-input:focus {
          border-color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.05), 0 0 28px rgba(255,255,255,0.04);
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
        .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }

        .resend-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #fff;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 1px;
          transition: opacity 0.2s, border-color 0.2s;
        }
        .resend-btn:hover { opacity: 0.55; border-color: transparent; }
        .resend-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .field-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 10px;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-100px', left: '50%',
          transform: 'translateX(-50%)',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Decorative rings */}
        {[320, 220, 130].map((size, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${size}px`, height: `${size}px`,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.03)',
            pointerEvents: 'none'
          }} />
        ))}

        <div style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 1 }}>

          {/* Logo */}
          <div className="anim-1" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '52px',
              fontWeight: 300,
              color: '#fff',
              letterSpacing: '0.16em',
              lineHeight: 1
            }}>
              Sphere
            </h1>
            <div style={{
              width: '28px', height: '1px',
              background: 'rgba(255,255,255,0.18)',
              margin: '15px auto 13px'
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

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '18px',
            padding: '36px 32px',
            animation: 'pulseGlow 4s ease-in-out infinite'
          }}>

            {/* Email icon */}
            <div className="anim-2" style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{
                width: '52px', height: '52px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h2 style={{
                color: '#fff',
                fontSize: '21px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: '8px'
              }}>
                Check your email
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.25)',
                fontSize: '13px',
                lineHeight: 1.6,
                fontFamily: "'DM Sans', sans-serif"
              }}>
                We sent a 6-digit code to
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: 500,
                marginTop: '4px',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.01em'
              }}>
                {email}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="anim-2" style={{
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

            {/* Resent success */}
            {resent && (
              <div className="anim-2" style={{
                background: 'rgba(60,255,120,0.06)',
                border: '1px solid rgba(60,255,120,0.2)',
                color: 'rgba(160,255,180,0.9)',
                padding: '11px 15px',
                borderRadius: '10px',
                marginBottom: '18px',
                fontSize: '13px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                fontFamily: "'DM Sans', sans-serif"
              }}>
                ✓ Code resent — check your inbox
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div className="anim-3">
                <label className="field-label">Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="otp-input"
                  placeholder="······"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <div className="anim-4">
                <button type="submit" disabled={loading || code.length !== 6} className="btn-primary">
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <svg style={{ animation: 'spin 1s linear infinite', width: 15, height: 15 }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.75 }} />
                      </svg>
                      Verifying...
                    </span>
                  ) : 'Verify Email →'}
                </button>
              </div>

            </form>

            {/* Resend + expiry */}
            <div className="anim-5" style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <p style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: '12px',
                fontFamily: "'DM Sans', sans-serif"
              }}>
                Didn't receive the code?{' '}
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="resend-btn"
                >
                  {resending ? 'Resending...' : 'Resend'}
                </button>
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.13)',
                fontSize: '11px',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.02em'
              }}>
                Code expires in 10 minutes
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}