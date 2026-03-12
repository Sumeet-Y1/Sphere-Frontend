import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function OAuth2Callback() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      handleCallback(token)
    } else {
      navigate('/login')
    }
  }, [])

  const handleCallback = async (token) => {
    try {
      const res = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      login(token, {
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
        avatarUrl: res.data.avatarUrl,
        authProvider: res.data.authProvider
      })
      navigate('/')
    } catch (err) {
      console.error(err)
      navigate('/login')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@300;400&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .spin { animation: spin 1s linear infinite; }
        .fade { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}>

        <div style={{
          position: 'absolute',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }} />

        {[300, 200, 120].map((size, i) => (
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

        <div className="fade" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '42px',
            fontWeight: 300,
            color: '#fff',
            letterSpacing: '0.16em',
            lineHeight: 1,
            marginBottom: '14px'
          }}>
            Sphere
          </h1>
          <div style={{
            width: '24px', height: '1px',
            background: 'rgba(255,255,255,0.15)',
            margin: '0 auto 32px'
          }} />

          <svg
            className="spin"
            style={{ width: 28, height: 28, margin: '0 auto 20px', display: 'block' }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" style={{ opacity: 0.15 }} />
            <path fill="white" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.6 }} />
          </svg>

          <p style={{
            color: 'rgba(255,255,255,0.28)',
            fontSize: '13px',
            letterSpacing: '0.02em'
          }}>
            Signing you in with Google...
          </p>
        </div>
      </div>
    </>
  )
}