import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally { setLoading(false) }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (otp.length !== 6) return setError('Enter a valid 6-digit OTP')
    setStep(3)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) return setError('Passwords do not match!')
    if (newPassword.length < 6) return setError('Password must be at least 6 characters!')
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email, code: otp, newPassword })
      navigate('/login', { state: { message: 'Password reset successfully! Please login.' } })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally { setLoading(false) }
  }

  const handleResendOtp = async () => {
    try {
      await api.post('/auth/forgot-password', { email })
      setError('')
    } catch (err) {
      setError('Failed to resend OTP')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fp-up   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fp-spin { to{transform:rotate(360deg)} }
        @keyframes fp-step { from{opacity:0;transform:translateY(10px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

        .fp-a1 { animation: fp-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .fp-a2 { animation: fp-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .fp-a3 { animation: fp-step 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .fp-spin { animation: fp-spin 1s linear infinite; }

        .fp-input {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #fff; padding: 13px 16px;
          border-radius: 11px; font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .fp-input::placeholder { color: rgba(255,255,255,0.18); }
        .fp-input:hover  { border-color: rgba(255,255,255,0.16); }
        .fp-input:focus  { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.06); box-shadow: 0 0 0 3px rgba(255,255,255,0.05); }

        .fp-otp {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #fff; padding: 20px 16px;
          border-radius: 14px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px; font-weight: 300;
          letter-spacing: 0.5em; text-align: center;
          text-indent: 0.5em; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .fp-otp::placeholder { color: rgba(255,255,255,0.1); font-size: 22px; letter-spacing: 0.3em; }
        .fp-otp:focus { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.06); box-shadow: 0 0 0 3px rgba(255,255,255,0.05); }

        .fp-btn {
          width: 100%; padding: 14px; border-radius: 11px; border: none;
          background: #fff; color: #000;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 600;
          letter-spacing: 0.04em; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.18s, transform 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden;
        }
        .fp-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
        }
        .fp-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(255,255,255,0.18); }
        .fp-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
        .fp-btn:disabled { opacity: 0.38; cursor: not-allowed; }

        .fp-label {
          display: block; font-size: 10.5px; font-weight: 500;
          color: rgba(255,255,255,0.28); letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .fp-error {
          background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.18);
          color: rgba(252,165,165,0.9); padding: 11px 14px;
          border-radius: 10px; font-size: 12.5px;
          display: flex; align-items: center; gap: 8px;
        }
        .fp-step-dot {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600;
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
          font-family: 'DM Sans', sans-serif;
        }
        .fp-step-line {
          width: 28px; height: 1px;
          transition: background 0.35s;
        }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', fontFamily:"'DM Sans',sans-serif", position:'relative', overflow:'hidden' }}>

        {/* Ambient glow */}
        <div style={{ position:'absolute', width:560, height:560, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,0.022) 0%, transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
        {[320, 210, 130].map((s, i) => (
          <div key={i} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:s, height:s, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.03)', pointerEvents:'none' }} />
        ))}

        <div style={{ width:'100%', maxWidth:380, position:'relative', zIndex:1 }}>

          {/* Logo */}
          <div className="fp-a1" style={{ textAlign:'center', marginBottom:44 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:46, fontWeight:300, color:'#fff', letterSpacing:'0.16em', lineHeight:1, margin:0 }}>Sphere</p>
            <div style={{ width:26, height:1, background:'rgba(255,255,255,0.14)', margin:'13px auto 11px' }} />
            <p style={{ color:'rgba(255,255,255,0.18)', fontSize:'9.5px', letterSpacing:'0.26em', textTransform:'uppercase', margin:0 }}>Your world, your communities</p>
          </div>

          {/* Card */}
          <div className="fp-a2" style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'32px 28px' }}>

            {/* Step indicator */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:32 }}>
              {[1,2,3].map((s) => (
                <div key={s} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div className="fp-step-dot" style={{
                    background: step > s ? '#fff' : step === s ? '#fff' : 'rgba(255,255,255,0.07)',
                    color: step >= s ? '#000' : 'rgba(255,255,255,0.25)',
                    boxShadow: step === s ? '0 0 0 4px rgba(255,255,255,0.07)' : 'none',
                  }}>
                    {step > s ? (
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                      </svg>
                    ) : s}
                  </div>
                  {s < 3 && (
                    <div className="fp-step-line" style={{ background: step > s ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1 — Email */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="fp-a3" style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div>
                  <p style={{ fontSize:18, fontWeight:500, color:'rgba(255,255,255,0.82)', marginBottom:6 }}>Forgot password?</p>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.28)', lineHeight:1.65, margin:0 }}>Enter your email and we'll send you a reset code.</p>
                </div>
                <div>
                  <label className="fp-label">Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="fp-input" placeholder="you@example.com" autoFocus />
                </div>
                {error && <div className="fp-error"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{error}</div>}
                <button type="submit" disabled={loading} className="fp-btn">
                  {loading ? <><svg className="fp-spin" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="black" strokeWidth="3" style={{opacity:0.2}}/><path fill="black" d="M4 12a8 8 0 018-8v8z" style={{opacity:0.6}}/></svg>Sending...</> : 'Send Reset Code →'}
                </button>
              </form>
            )}

            {/* Step 2 — OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="fp-a3" style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div>
                  <p style={{ fontSize:18, fontWeight:500, color:'rgba(255,255,255,0.82)', marginBottom:6 }}>Check your email</p>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.28)', lineHeight:1.65, margin:0 }}>
                    We sent a 6-digit code to <span style={{ color:'rgba(255,255,255,0.65)' }}>{email}</span>
                  </p>
                </div>
                <div>
                  <label className="fp-label">Reset code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                    required maxLength={6} autoFocus
                    className="fp-otp"
                    placeholder="000000"
                  />
                </div>
                {error && <div className="fp-error"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{error}</div>}
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <button type="submit" disabled={otp.length !== 6} className="fp-btn">Verify Code →</button>
                  <button type="button" onClick={handleResendOtp}
                    style={{ background:'none', border:'none', color:'rgba(255,255,255,0.25)', fontSize:12.5, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'color 0.2s', padding:'4px 0' }}
                    onMouseEnter={e=>e.target.style.color='rgba(255,255,255,0.6)'}
                    onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.25)'}>
                    Didn't receive it? Resend code
                  </button>
                </div>
              </form>
            )}

            {/* Step 3 — New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="fp-a3" style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div>
                  <p style={{ fontSize:18, fontWeight:500, color:'rgba(255,255,255,0.82)', marginBottom:6 }}>Set new password</p>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.28)', lineHeight:1.65, margin:0 }}>Choose a strong password for your account.</p>
                </div>
                <div>
                  <label className="fp-label">New password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="fp-input" placeholder="Min. 6 characters" autoFocus />
                </div>
                <div>
                  <label className="fp-label">Confirm password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="fp-input" placeholder="Repeat your password" />
                </div>
                {error && <div className="fp-error"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{error}</div>}
                <button type="submit" disabled={loading} className="fp-btn">
                  {loading ? <><svg className="fp-spin" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="black" strokeWidth="3" style={{opacity:0.2}}/><path fill="black" d="M4 12a8 8 0 018-8v8z" style={{opacity:0.6}}/></svg>Resetting...</> : 'Reset Password →'}
                </button>
              </form>
            )}

          </div>

          {/* Back to login */}
          <div style={{ textAlign:'center', marginTop:22 }}>
            <Link to="/login"
              style={{ color:'rgba(255,255,255,0.22)', fontSize:12.5, textDecoration:'none', fontFamily:"'DM Sans',sans-serif", transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='rgba(255,255,255,0.55)'}
              onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.22)'}>
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}