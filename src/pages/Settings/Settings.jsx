import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Settings() {
  const { user, logout, updateUser } = useAuth()
  const { theme, setThemePreference } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [blockedUsers, setBlockedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [privateAccount, setPrivateAccount] = useState(Boolean(user?.privateAccount))
  const [pendingRequests, setPendingRequests] = useState([])

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const [notifSettings, setNotifSettings] = useState({
    dmNotifs: true,
    commentNotifs: true,
    upvoteNotifs: true,
    followNotifs: true,
  })

  useEffect(() => {
    if (activeTab === 'blocked') fetchBlockedUsers()
    if (activeTab === 'privacy') fetchPendingRequests()
  }, [activeTab])

  useEffect(() => {
    setUsername(user?.username || '')
    setBio(user?.bio || '')
    setPrivateAccount(Boolean(user?.privateAccount))
  }, [user])

  const fetchBlockedUsers = async () => {
    try {
      const res = await api.get('/users/me/blocked')
      setBlockedUsers(res.data)
    } catch (err) { console.error(err) }
  }

  const fetchPendingRequests = async () => {
    try {
      const res = await api.get('/users/me/follow-requests')
      setPendingRequests(res.data)
    } catch (err) { console.error(err) }
  }

  const showSuccess = (msg) => {
    setSuccess(msg); setError('')
    setTimeout(() => setSuccess(''), 3000)
  }

  const showError = (msg) => {
    setError(msg); setSuccess('')
    setTimeout(() => setError(''), 3000)
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const previousUsername = user?.username
      const res = await api.put('/users/me', { username, bio })
      setUsername(res.data.username || '')
      setBio(res.data.bio || '')
      updateUser({
        username: res.data.username,
        bio: res.data.bio,
        avatarUrl: res.data.avatarUrl,
        privateAccount: res.data.privateAccount,
      })
      showSuccess('Profile updated successfully!')
      if (previousUsername && previousUsername !== res.data.username) {
        navigate(`/profile/${res.data.username}`)
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile')
    } finally { setLoading(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return showError('Passwords do not match!')
    if (newPassword.length < 6) return showError('Password must be at least 6 characters!')
    setLoading(true)
    try {
      await api.put('/users/me/password', { currentPassword, newPassword })
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      showSuccess('Password changed successfully!')
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password')
    } finally { setLoading(false) }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm.trim().toLowerCase() !== 'confirm') {
      showError('Type confirm to delete your account.')
      return
    }
    setLoading(true)
    try {
      await api.delete('/users/me')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      logout(); navigate('/login')
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete account')
      setLoading(false)
    }
  }

  const handleUnblock = async (username) => {
    try {
      await api.post(`/users/${username}/unblock`)
      setBlockedUsers(prev => prev.filter(u => u.username !== username))
      showSuccess(`Unblocked ${username}`)
    } catch (err) { showError('Failed to unblock user') }
  }

  const handleThemeChange = async (t) => {
    const previousTheme = theme
    setThemePreference(t)
    updateUser({ theme: t })

    try {
      await api.put('/users/me', { theme: t })
      showSuccess('Theme preference saved!')
    } catch (err) {
      setThemePreference(previousTheme)
      updateUser({ theme: previousTheme })
      showError(err.response?.data?.message || 'Failed to save theme preference')
    }
  }

  const handlePrivacyToggle = async () => {
    setLoading(true)
    try {
      const res = await api.put('/users/me', { privateAccount: !privateAccount })
      setPrivateAccount(res.data.privateAccount)
      updateUser({
        username: res.data.username,
        bio: res.data.bio,
        avatarUrl: res.data.avatarUrl,
        privateAccount: res.data.privateAccount,
      })
      if (res.data.privateAccount) {
        fetchPendingRequests()
        showSuccess('Account is now private')
      } else {
        setPendingRequests([])
        showSuccess('Account is now public')
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update privacy')
    } finally { setLoading(false) }
  }

  const handleFollowRequest = async (requestId, action) => {
    try {
      await api.post(`/users/me/follow-requests/${requestId}/${action}`)
      setPendingRequests(prev => prev.filter(req => req.id !== requestId))
      showSuccess(action === 'accept' ? 'Follow request accepted' : 'Follow request rejected')
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update follow request')
    }
  }

  const tabs = [
    { id: 'profile',       label: 'Profile',       icon: <IcoUser /> },
    { id: 'privacy',       label: 'Privacy',       icon: <IcoShield /> },
    { id: 'password',      label: 'Password',      icon: <IcoLock /> },
    { id: 'notifications', label: 'Notifications', icon: <IcoBell /> },
    { id: 'theme',         label: 'Theme',         icon: <IcoPalette /> },
    { id: 'blocked',       label: 'Blocked',       icon: <IcoBlock /> },
    { id: 'danger',        label: 'Account',       icon: <IcoTrash /> },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes st-fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes st-toast  { 0%{opacity:0;transform:translateY(-6px)} 10%,90%{opacity:1;transform:translateY(0)} 100%{opacity:0} }

        .st-root { min-height:100vh; background:var(--theme-bg); font-family:'DM Sans',sans-serif; padding: 48px 20px; transition: background-color 0.18s ease; }
        .st-inner { max-width: 860px; margin: 0 auto; }

        .st-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px; font-weight: 300;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.1em;
          margin-bottom: 32px;
        }

        /* Toast */
        .st-toast {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border-radius: 12px; margin-bottom: 20px;
          font-size: 13px; font-weight: 400;
          animation: st-toast 3s cubic-bezier(0.16,1,0.3,1) both;
        }
        .st-toast.success { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.18); color: rgba(134,239,172,0.9); }
        .st-toast.error   { background: rgba(239,68,68,0.08);  border: 1px solid rgba(239,68,68,0.18);  color: rgba(252,165,165,0.9); }

        /* Layout */
        .st-layout { display: flex; gap: 20px; align-items: flex-start; }
        @media(max-width:680px) { .st-layout { flex-direction:column; } }

        /* Sidebar */
        .st-sidebar { width: 176px; flex-shrink: 0; display: flex; flex-direction: column; gap: 2px; }
        @media(max-width:680px) { .st-sidebar { width:100%; flex-direction:row; overflow-x:auto; gap:4px; scrollbar-width:none; } }
        .st-sidebar::-webkit-scrollbar { display:none; }

        .st-tab {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px;
          font-size: 12.5px; font-weight: 400;
          color: rgba(255,255,255,0.38);
          background: transparent; border: none; cursor: pointer;
          transition: all 0.15s; text-align: left; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .st-tab:hover { color: rgba(255,255,255,0.72); background: rgba(255,255,255,0.04); }
        .st-tab.active { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.07); }
        .st-tab.danger-tab { color: rgba(239,68,68,0.55); }
        .st-tab.danger-tab:hover { color: rgba(252,165,165,0.8); background: rgba(239,68,68,0.06); }
        .st-tab.danger-tab.active { color: rgba(252,165,165,0.9); background: rgba(239,68,68,0.08); }

        /* Card */
        .st-card {
          flex: 1; min-width: 0;
          background: var(--theme-surface);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 28px;
          animation: st-fadeUp 0.25s cubic-bezier(0.16,1,0.3,1) both;
        }
        .st-card-title {
          font-size: 15px; font-weight: 500;
          color: rgba(255,255,255,0.75);
          margin-bottom: 22px; padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          letter-spacing: 0.02em;
        }

        /* Form elements */
        .st-label { display:block; font-size:11px; font-weight:500; color:rgba(255,255,255,0.3); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:7px; }
        .st-input {
          width: 100%; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff; border-radius: 10px;
          padding: 11px 14px; font-size: 13px;
          outline: none; transition: border-color 0.18s, box-shadow 0.18s;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }
        .st-input:focus { border-color: rgba(255,255,255,0.22); box-shadow: 0 0 0 3px rgba(255,255,255,0.04); }
        .st-input::placeholder { color: rgba(255,255,255,0.18); }
        .st-textarea { resize: none; }
        .st-field { margin-bottom: 18px; }

        /* Buttons */
        .st-btn-primary {
          background: #fff; color: #000;
          font-size: 12.5px; font-weight: 600;
          padding: 9px 22px; border-radius: 9px; border: none;
          cursor: pointer; transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .st-btn-primary:hover { opacity: 0.88; }
        .st-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Toggle */
        .st-toggle-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
        .st-toggle-row:last-child { border-bottom:none; }
        .st-toggle {
          width: 40px; height: 22px; border-radius: 11px; border: none; cursor: pointer;
          position: relative; transition: background 0.2s; flex-shrink: 0;
        }
        .st-toggle-thumb {
          position:absolute; top:2px; width:18px; height:18px;
          background:#000; border-radius:50%; transition:left 0.2s;
        }

        /* Theme cards */
        .st-theme-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
        .st-theme-card {
          padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.02); cursor:pointer;
          transition:all 0.18s; text-align:left;
          font-family:'DM Sans',sans-serif;
        }
        .st-theme-card:hover { border-color:rgba(255,255,255,0.2); background:rgba(255,255,255,0.04); }
        .st-theme-card.selected { border-color:rgba(255,255,255,0.35); background:rgba(255,255,255,0.07); }
        .st-theme-card:disabled { opacity:0.3; cursor:not-allowed; }

        /* Blocked user row */
        .st-user-row { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
        .st-user-row:last-child { border-bottom:none; }
        .st-btn-ghost {
          font-size:11.5px; font-weight:500;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
          color:rgba(255,255,255,0.45); padding:6px 14px; border-radius:8px;
          cursor:pointer; transition:all 0.15s; font-family:'DM Sans',sans-serif;
        }
        .st-btn-ghost:hover { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.8); }

        /* Danger */
        .st-danger-box {
          border:1px solid rgba(239,68,68,0.15);
          border-radius:14px; padding:20px;
          background:rgba(239,68,68,0.04);
        }
        .st-btn-danger {
          font-size:12px; font-weight:500;
          background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2);
          color:rgba(252,165,165,0.8); padding:8px 18px; border-radius:9px;
          cursor:pointer; transition:all 0.18s; font-family:'DM Sans',sans-serif;
        }
        .st-btn-danger:hover { background:rgba(239,68,68,0.14); color:#fca5a5; }
        .st-btn-danger:disabled { opacity:0.38; cursor:not-allowed; background:rgba(239,68,68,0.05); color:rgba(252,165,165,0.45); }
        .st-danger-confirm { margin:16px 0; }
        .st-danger-note {
          display:flex; gap:10px; align-items:flex-start;
          border:1px solid rgba(239,68,68,0.12);
          background:rgba(239,68,68,0.035);
          border-radius:12px; padding:12px; margin-bottom:14px;
        }

        /* Google account empty state */
        .st-empty { text-align:center; padding:40px 0; }
      `}</style>

      <div className="st-root">
        <div className="st-inner">

          <p className="st-heading">Settings</p>

          {/* Toasts */}
          {success && (
            <div className="st-toast success">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              {success}
            </div>
          )}
          {error && (
            <div className="st-toast error">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              {error}
            </div>
          )}

          <div className="st-layout">

            {/* ── Sidebar ── */}
            <div className="st-sidebar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`st-tab${activeTab === tab.id ? ' active' : ''}${tab.id === 'danger' ? ' danger-tab' : ''}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Content Card ── */}
            <div className="st-card" key={activeTab}>

              {/* Profile */}
              {activeTab === 'profile' && (
                <form onSubmit={handleUpdateProfile}>
                  <p className="st-card-title">Edit Profile</p>
                  <div className="st-field">
                    <label className="st-label">Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="st-input" />
                    <p style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.22)', lineHeight: 1.5 }}>
                      Your public profile link updates when you save a new username.
                    </p>
                  </div>
                  <div className="st-field">
                    <label className="st-label">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="st-input st-textarea" placeholder="Tell us about yourself..." />
                  </div>
                  <button type="submit" disabled={loading} className="st-btn-primary">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <p className="st-card-title">Privacy & Requests</p>
                  <div className="st-toggle-row" style={{ paddingTop: 0 }}>
                    <div>
                      <p style={{ fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.72)',marginBottom:3 }}>Private Account</p>
                      <p style={{ fontSize:11.5,color:'rgba(255,255,255,0.25)',lineHeight:1.6 }}>
                        Only approved followers can view your full profile and posts when this is enabled.
                      </p>
                    </div>
                    <button
                      onClick={handlePrivacyToggle}
                      className="st-toggle"
                      style={{ background: privateAccount ? '#fff' : 'rgba(255,255,255,0.08)' }}
                    >
                      <div className="st-toggle-thumb" style={{ left: privateAccount ? '20px' : '2px', background: privateAccount ? '#000' : 'rgba(255,255,255,0.3)' }} />
                    </button>
                  </div>

                  <div style={{ marginTop: 24 }}>
                    <p style={{ fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.72)',marginBottom:10 }}>Pending Follow Requests</p>
                    {!privateAccount ? (
                      <div className="st-empty">
                        <p style={{ fontSize:12,color:'rgba(255,255,255,0.25)' }}>Turn on private account to review follow requests here.</p>
                      </div>
                    ) : pendingRequests.length === 0 ? (
                      <div className="st-empty">
                        <p style={{ fontSize:12,color:'rgba(255,255,255,0.25)' }}>No pending requests right now.</p>
                      </div>
                    ) : (
                      pendingRequests.map(req => (
                        <div key={req.id} className="st-user-row">
                          <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                            <img src={req.requesterAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.requesterUsername}`}
                              style={{ width:36,height:36,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.08)' }} />
                            <div>
                              <p style={{ fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.75)',marginBottom:2 }}>{req.requesterUsername}</p>
                              <p style={{ fontSize:11,color:'rgba(255,255,255,0.25)' }}>{req.requesterBio || 'Wants to follow you'}</p>
                            </div>
                          </div>
                          <div style={{ display:'flex',gap:8 }}>
                            <button onClick={() => handleFollowRequest(req.id, 'accept')} className="st-btn-primary" style={{ padding:'7px 12px' }}>Accept</button>
                            <button onClick={() => handleFollowRequest(req.id, 'reject')} className="st-btn-ghost">Decline</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Password */}
              {activeTab === 'password' && (
                user?.authProvider === 'GOOGLE' ? (
                  <div className="st-empty">
                    <div style={{ width:44,height:44,borderRadius:12,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px' }}>
                      <IcoLock color="rgba(255,255,255,0.25)" size={18} />
                    </div>
                    <p style={{ fontSize:14,fontWeight:500,color:'rgba(255,255,255,0.6)',marginBottom:6 }}>Google Account</p>
                    <p style={{ fontSize:12,color:'rgba(255,255,255,0.25)' }}>You signed in with Google. Password management is handled by Google.</p>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword}>
                    <p className="st-card-title">Change Password</p>
                    <div className="st-field">
                      <label className="st-label">Current Password</label>
                      <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="st-input" placeholder="Enter current password" />
                    </div>
                    <div className="st-field">
                      <label className="st-label">New Password</label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="st-input" placeholder="Min. 6 characters" />
                    </div>
                    <div className="st-field">
                      <label className="st-label">Confirm New Password</label>
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="st-input" placeholder="Repeat new password" />
                    </div>
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                      <button type="submit" disabled={loading} className="st-btn-primary">
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                      <Link to="/forgot-password" style={{ fontSize:12,color:'rgba(255,255,255,0.25)',textDecoration:'none',transition:'color 0.15s' }}
                        onMouseEnter={e=>e.target.style.color='rgba(255,255,255,0.6)'}
                        onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.25)'}>
                        Forgot password?
                      </Link>
                    </div>
                  </form>
                )
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div>
                  <p className="st-card-title">Notification Preferences</p>
                  {[
                    { key: 'dmNotifs',      label: 'Direct Messages', desc: 'Get notified when someone DMs you' },
                    { key: 'commentNotifs', label: 'Comments',        desc: 'Get notified when someone comments on your post' },
                    { key: 'upvoteNotifs',  label: 'Upvotes',         desc: 'Get notified when someone upvotes your post' },
                    { key: 'followNotifs',  label: 'Follows',         desc: 'Get notified when someone follows you' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="st-toggle-row">
                      <div>
                        <p style={{ fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.72)',marginBottom:3 }}>{label}</p>
                        <p style={{ fontSize:11.5,color:'rgba(255,255,255,0.25)' }}>{desc}</p>
                      </div>
                      <button
                        onClick={() => { setNotifSettings(prev => ({ ...prev, [key]: !prev[key] })); showSuccess('Preferences saved!') }}
                        className="st-toggle"
                        style={{ background: notifSettings[key] ? '#fff' : 'rgba(255,255,255,0.08)' }}
                      >
                        <div className="st-toggle-thumb" style={{ left: notifSettings[key] ? '20px' : '2px', background: notifSettings[key] ? '#000' : 'rgba(255,255,255,0.3)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Theme */}
              {activeTab === 'theme' && (
                <div>
                  <p className="st-card-title">Theme Preferences</p>
                  <p style={{ fontSize:12.5,color:'rgba(255,255,255,0.28)',marginBottom:18 }}>Choose your preferred appearance</p>
                  <div className="st-theme-grid">
                    {[
                      { id:'dark',  label:'Dark',  desc:'Pure black',  dot:'#080808' },
                      { id:'dim',   label:'Dim',   desc:'Dark gray',   dot:'#1a1a1a' },
                      { id:'light', label:'Light', desc:'Coming soon', dot:'#f5f5f5', disabled:true },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => !t.disabled && handleThemeChange(t.id)}
                        disabled={t.disabled}
                        className={`st-theme-card${theme === t.id ? ' selected' : ''}`}
                      >
                        <div style={{ width:28,height:28,borderRadius:8,background:t.dot,border:'1px solid rgba(255,255,255,0.12)',marginBottom:10 }} />
                        <p style={{ fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.72)',marginBottom:3 }}>{t.label}</p>
                        <p style={{ fontSize:11,color:'rgba(255,255,255,0.25)' }}>{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Blocked */}
              {activeTab === 'blocked' && (
                <div>
                  <p className="st-card-title">Blocked Users</p>
                  {blockedUsers.length === 0 ? (
                    <div className="st-empty">
                      <div style={{ width:44,height:44,borderRadius:12,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px' }}>
                        <IcoBlock color="rgba(255,255,255,0.2)" size={18} />
                      </div>
                      <p style={{ fontSize:13,color:'rgba(255,255,255,0.25)' }}>No blocked users</p>
                    </div>
                  ) : (
                    blockedUsers.map(u => (
                      <div key={u.id} className="st-user-row">
                        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                          <img src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                            style={{ width:36,height:36,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.08)' }} />
                          <div>
                            <p style={{ fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.75)',marginBottom:2 }}>{u.username}</p>
                            <p style={{ fontSize:11,color:'rgba(255,255,255,0.25)' }}>{u.bio || 'No bio'}</p>
                          </div>
                        </div>
                        <button onClick={() => handleUnblock(u.username)} className="st-btn-ghost">Unblock</button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Danger Zone */}
              {activeTab === 'danger' && (
                <div>
                  <p className="st-card-title">Danger Zone</p>
                  <div className="st-danger-box">
                    <p style={{ fontSize:13,fontWeight:500,color:'rgba(252,165,165,0.8)',marginBottom:6 }}>Delete Account</p>
                    <p style={{ fontSize:12,color:'rgba(255,255,255,0.28)',marginBottom:16,lineHeight:1.6 }}>
                      Permanently delete your account, posts, comments, votes, direct messages, follows, blocks, community memberships, and communities you own. This action cannot be undone.
                    </p>
                    <div className="st-danger-note">
                      <IcoTrash color="rgba(252,165,165,0.75)" size={16} />
                      <p style={{ fontSize:12,color:'rgba(252,165,165,0.72)',lineHeight:1.55 }}>
                        Type <span style={{ fontWeight:600,color:'rgba(255,255,255,0.86)' }}>confirm</span> below to unlock account deletion.
                      </p>
                    </div>
                    <div className="st-danger-confirm">
                      <label className="st-label">Confirmation</label>
                      <input
                        type="text"
                        value={deleteConfirm}
                        onChange={e => setDeleteConfirm(e.target.value)}
                        className="st-input"
                        placeholder="Type confirm"
                        autoComplete="off"
                      />
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading || deleteConfirm.trim().toLowerCase() !== 'confirm'}
                      className="st-btn-danger"
                    >
                      {loading ? 'Deleting...' : 'Delete My Account'}
                    </button>
                  </div>
                </div>
              )} 
   
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Icons ───────────────────────────────────────────
const IcoUser    = ({ color='currentColor', size=14 }) => <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
const IcoShield  = ({ color='currentColor', size=14 }) => <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z"/></svg>
const IcoLock    = ({ color='currentColor', size=14 }) => <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
const IcoBell    = ({ color='currentColor', size=14 }) => <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
const IcoPalette = ({ color='currentColor', size=14 }) => <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
const IcoBlock   = ({ color='currentColor', size=14 }) => <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color}><circle cx="12" cy="12" r="10" strokeWidth={1.8}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.93 4.93l14.14 14.14"/></svg>
const IcoTrash   = ({ color='currentColor', size=14 }) => <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
