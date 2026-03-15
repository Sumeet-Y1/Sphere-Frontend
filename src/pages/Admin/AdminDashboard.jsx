import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const adminApi = axios.create({ baseURL: 'http://localhost:8080/api' })
adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminApi.get('/admin/stats'),
        adminApi.get('/admin/users'),
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)

      const [postsRes, commRes] = await Promise.all([
        adminApi.get('/posts'),
        adminApi.get('/communities'),
      ])
      setPosts(postsRes.data)
      setCommunities(commRes.data)
    } catch (err) {
      if (err.response?.status === 403) {
        localStorage.removeItem('adminToken')
        navigate('/admin/access')
      }
    } finally {
      setLoading(false)
    }
  }

  const banUser = async (userId) => {
    await adminApi.put(`/admin/users/${userId}/ban`)
    fetchAll()
  }

  const unbanUser = async (userId) => {
    await adminApi.put(`/admin/users/${userId}/unban`)
    fetchAll()
  }

  const promoteUser = async (userId) => {
    if (!confirm('Promote this user to moderator?')) return
    await adminApi.put(`/admin/users/${userId}/promote`)
    fetchAll()
  }

  const deletePost = async (postId) => {
    if (!confirm('Delete this post?')) return
    await adminApi.delete(`/admin/posts/${postId}`)
    fetchAll()
  }

  const deleteCommunity = async (communityId) => {
    if (!confirm('Delete this community? This cannot be undone!')) return
    await adminApi.delete(`/admin/communities/${communityId}`)
    fetchAll()
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/access')
  }

  const TABS = [
    { id: 'stats', label: '📊 Stats' },
    { id: 'users', label: '👥 Users' },
    { id: 'posts', label: '📝 Posts' },
    { id: 'communities', label: '🏘️ Communities' },
  ]

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
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        .ad-wrap { min-height: 100vh; background: #080808; font-family: 'DM Sans', sans-serif; }
        .ad-inner { max-width: 1100px; margin: 0 auto; padding: 32px 24px 80px; }

        /* Header */
        .ad-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; animation: fadeUp 0.6s ease both; }
        .ad-logo { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: #fff; letter-spacing: 0.12em; }
        .ad-logo span { font-size: 11px; font-family: 'DM Sans', sans-serif; color: rgba(255,255,255,0.2); letter-spacing: 0.2em; text-transform: uppercase; display: block; margin-top: 2px; }

        /* Tabs */
        .ad-tabs { display: flex; gap: 6px; margin-bottom: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 4px; animation: fadeUp 0.6s ease 0.05s both; }
        .ad-tab { flex: 1; padding: 10px; border-radius: 8px; border: none; background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.3); transition: all 0.2s; }
        .ad-tab:hover { color: rgba(255,255,255,0.7); }
        .ad-tab.active { background: rgba(255,255,255,0.08); color: #fff; font-weight: 500; }

        /* Stats grid */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; animation: fadeUp 0.6s ease 0.1s both; }
        .stat-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 22px 24px; }
        .stat-value { font-size: 36px; font-weight: 600; color: #fff; line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 11px; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 0.12em; }

        /* Table */
        .ad-table { width: 100%; border-collapse: collapse; animation: fadeUp 0.6s ease 0.1s both; }
        .ad-table th { text-align: left; font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.25); padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ad-table td { padding: 13px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; color: rgba(255,255,255,0.6); vertical-align: middle; }
        .ad-table tr:last-child td { border-bottom: none; }
        .ad-table tr:hover td { background: rgba(255,255,255,0.015); }

        .table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }

        /* Badges */
        .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 500; letter-spacing: 0.05em; }
        .badge-admin { background: rgba(255,200,80,0.12); color: rgba(255,200,80,0.8); border: 1px solid rgba(255,200,80,0.2); }
        .badge-mod { background: rgba(100,180,255,0.1); color: rgba(100,180,255,0.8); border: 1px solid rgba(100,180,255,0.2); }
        .badge-user { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.08); }
        .badge-banned { background: rgba(255,60,60,0.1); color: rgba(255,100,100,0.8); border: 1px solid rgba(255,60,60,0.2); }

        /* Action buttons */
        .act-btn { padding: 5px 10px; border-radius: 6px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; transition: all 0.2s; margin-right: 6px; }
        .act-ban { background: rgba(255,60,60,0.1); color: rgba(255,100,100,0.8); border: 1px solid rgba(255,60,60,0.2); }
        .act-ban:hover { background: rgba(255,60,60,0.2); }
        .act-unban { background: rgba(100,255,150,0.08); color: rgba(100,255,150,0.7); border: 1px solid rgba(100,255,150,0.2); }
        .act-unban:hover { background: rgba(100,255,150,0.15); }
        .act-promote { background: rgba(100,180,255,0.08); color: rgba(100,180,255,0.7); border: 1px solid rgba(100,180,255,0.2); }
        .act-promote:hover { background: rgba(100,180,255,0.15); }
        .act-delete { background: rgba(255,60,60,0.08); color: rgba(255,100,100,0.7); border: 1px solid rgba(255,60,60,0.15); }
        .act-delete:hover { background: rgba(255,60,60,0.18); }

        /* Logout */
        .logout-btn { padding: 8px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: rgba(255,255,255,0.4); font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; transition: all 0.2s; }
        .logout-btn:hover { background: rgba(255,60,60,0.1); border-color: rgba(255,60,60,0.2); color: rgba(255,100,100,0.8); }

        .avatar { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); }
      `}</style>

      <div className="ad-wrap">
        <div className="ad-inner">

          {/* Header */}
          <div className="ad-header">
            <div>
              <div className="ad-logo">
                Sphere
                <span>Admin Dashboard</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>Sign Out</button>
          </div>

          {/* Tabs */}
          <div className="ad-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`ad-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          {activeTab === 'stats' && stats && (
            <div className="stats-grid">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="stat-card">
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div className="table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Provider</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            className="avatar"
                            src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                            alt=""
                          />
                          <span style={{ color: '#fff', fontWeight: 500 }}>{u.username}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : u.role === 'MODERATOR' ? 'badge-mod' : 'badge-user'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                        {u.authProvider || 'LOCAL'}
                      </td>
                      <td>
                        {u.role !== 'ADMIN' && (
                          <>
                            {u.banned ? (
                              <button className="act-btn act-unban" onClick={() => unbanUser(u.id)}>Unban</button>
                            ) : (
                              <button className="act-btn act-ban" onClick={() => banUser(u.id)}>Ban</button>
                            )}
                            {u.role === 'USER' && (
                              <button className="act-btn act-promote" onClick={() => promoteUser(u.id)}>Promote</button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Posts */}
          {activeTab === 'posts' && (
            <div className="table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Community</th>
                    <th>Type</th>
                    <th>Votes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p.id}>
                      <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
                        {p.title}
                      </td>
                      <td>{p.authorUsername}</td>
                      <td>s/{p.communityName}</td>
                      <td>
                        <span className="badge badge-user">{p.type}</span>
                      </td>
                      <td style={{ color: 'rgba(100,255,150,0.7)' }}>↑{p.upvotes}</td>
                      <td>
                        <button className="act-btn act-delete" onClick={() => deletePost(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Communities */}
          {activeTab === 'communities' && (
            <div className="table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Members</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {communities.map(c => (
                    <tr key={c.id}>
                      <td style={{ color: '#fff', fontWeight: 500 }}>s/{c.name}</td>
                      <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.description || '—'}
                      </td>
                      <td>{c.memberCount || 0}</td>
                      <td>
                        <button className="act-btn act-delete" onClick={() => deleteCommunity(c.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </>
  )
}