import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function Communities() {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchCommunities() }, [])

  const fetchCommunities = async () => {
    try {
      const res = await api.get('/communities')
      setCommunities(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (communityId) => {
    try {
      await api.post(`/communities/${communityId}/join`)
      fetchCommunities()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLeave = async (communityId) => {
    try {
      await api.delete(`/communities/${communityId}/leave`)
      fetchCommunities()
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      const res = await api.post('/communities', form)
      setShowCreate(false)
      setForm({ name: '', description: '' })
      fetchCommunities()
      navigate(`/community/${res.data.name}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create community')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg className="spin" style={{ width: 28, height: 28 }} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" style={{ opacity: 0.2 }} />
          <path fill="white" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.6 }} />
        </svg>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { left: -100%; }
          to   { left: 150%; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .comm-wrap {
          min-height: 100vh;
          background: #080808;
          font-family: 'DM Sans', sans-serif;
        }
        .comm-inner {
          max-width: 720px;
          margin: 0 auto;
          padding: 36px 20px 80px;
        }

        /* Header */
        .comm-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both;
        }

        /* Create form card */
        .create-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
          animation: slideDown 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* Community card */
        .comm-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px 20px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
          transition: border-color 0.2s, background 0.2s;
        }
        .comm-card:hover {
          border-color: rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.035);
        }

        /* Community icon */
        .comm-icon {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 300;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.05em;
        }

        /* Inputs */
        .glass-input, .glass-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #fff;
          padding: 13px 16px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.22s, background 0.22s, box-shadow 0.22s;
        }
        .glass-input::placeholder, .glass-textarea::placeholder { color: rgba(255,255,255,0.16); }
        .glass-input:hover, .glass-textarea:hover { border-color: rgba(255,255,255,0.18); }
        .glass-input:focus, .glass-textarea:focus {
          border-color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
        }
        .glass-textarea { resize: none; line-height: 1.65; }

        .field-label {
          display: block;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          margin-bottom: 9px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Buttons */
        .btn-primary {
          background: #fff;
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 13.5px;
          letter-spacing: 0.04em;
          padding: 11px 20px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
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
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(255,255,255,0.18); }
        .btn-primary:active { transform: translateY(0); box-shadow: none; }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

        .btn-ghost {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          padding: 11px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.14); }

        /* Join/Leave buttons */
        .btn-join {
          background: #fff;
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 8px 18px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          transition: transform 0.18s, box-shadow 0.2s;
          flex-shrink: 0;
        }
        .btn-join:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,255,255,0.18); }
        .btn-join:active { transform: translateY(0); }

        .btn-leave {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.35);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          padding: 8px 18px;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .btn-leave:hover { background: rgba(255,60,60,0.08); border-color: rgba(255,80,80,0.25); color: rgba(255,150,150,0.9); }

        .comm-link {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }
        .comm-link:hover { color: #fff; }
      `}</style>

      <div className="comm-wrap">
        <div className="comm-inner">

          {/* Header */}
          <div className="comm-header">
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300, color: '#fff', letterSpacing: '0.08em', lineHeight: 1 }}>
                Communities
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '13px', marginTop: '8px', fontFamily: "'DM Sans', sans-serif" }}>
                Find your people
              </p>
            </div>
            <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? 'Cancel' : '+ Create'}
            </button>
          </div>

          {/* Create form */}
          {showCreate && (
            <div className="create-card">
              <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", marginBottom: '20px', letterSpacing: '-0.01em' }}>
                Create a Community
              </h2>

              {error && (
                <div style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,200,200,0.9)', padding: '11px 15px', borderRadius: '10px', marginBottom: '18px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label className="field-label">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="glass-input"
                    placeholder="community-name"
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="glass-textarea"
                    placeholder="What is this community about?"
                    rows={3}
                  />
                </div>

                {/* Rule */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => { setShowCreate(false); setError('') }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={creating}>
                    {creating ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <svg style={{ animation: 'spin 1s linear infinite', width: 14, height: 14 }} viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                          <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.75 }} />
                        </svg>
                        Creating...
                      </span>
                    ) : 'Create Community →'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Empty state */}
          {communities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: 'rgba(255,255,255,0.07)', letterSpacing: '0.16em', marginBottom: '20px' }}>Sphere</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', fontWeight: 500, marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>No communities yet</p>
              <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>Be the first to create one!</p>
            </div>
          ) : (
            <div>
              {communities.map((community, i) => (
                <div
                  key={community.id}
                  className="comm-card"
                  style={{ animationDelay: `${0.08 + i * 0.05}s` }}
                >
                  {/* Left: icon + info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    <div className="comm-icon">
                      {community.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <Link to={`/community/${community.name}`} className="comm-link">
                        s/{community.name}
                      </Link>
                      {community.description && (
                        <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '12px', marginTop: '3px', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {community.description}
                        </p>
                      )}
                      <p style={{ color: 'rgba(255,255,255,0.16)', fontSize: '11px', marginTop: '4px', fontFamily: "'DM Sans', sans-serif" }}>
                        {community.memberCount} {community.memberCount === 1 ? 'member' : 'members'}
                      </p>
                    </div>
                  </div>

                  {/* Right: join/leave */}
                  {community.joined ? (
                    <button className="btn-leave" onClick={() => handleLeave(community.id)}>
                      Leave
                    </button>
                  ) : (
                    <button className="btn-join" onClick={() => handleJoin(community.id)}>
                      Join
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}