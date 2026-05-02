import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const communityColor = (name = '') => {
  const colors = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#06b6d4']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

const SORT_OPTIONS = [
  { key: 'hot',    label: 'Hot',    icon: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.6-7C14 5 15.929 5.777 17 7c1.487 1.306 2 3 2 4a8 8 0 01-2.343 7.657z"/></svg> },
  { key: 'new',    label: 'New',    icon: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  { key: 'top',    label: 'Top',    icon: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg> },
]        

export default function CommunityDetail() {
  const { communityName } = useParams()
  const { user } = useAuth()
  const [community, setCommunity] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('hot')
  const [joining, setJoining] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchCommunity() }, [communityName])

  const fetchCommunity = async () => {
    try {
      const communityRes = await api.get(`/communities/${communityName}`)
      setCommunity(communityRes.data)
      const postsRes = await api.get(`/posts/community/${communityRes.data.id}`)
      setPosts(postsRes.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleJoin = async () => {
    setJoining(true)
    try {
      if (community.joined) {
        await api.delete(`/communities/${community.id}/leave`)
      } else {
        await api.post(`/communities/${community.id}/join`)
      }
      fetchCommunity()
    } catch (err) { console.error(err) }
    finally { setJoining(false) }
  }

  const handleVote = async (postId, voteType) => {
    try {
      const res = await api.post(`/posts/${postId}/vote?voteType=${voteType}`)
      setPosts(posts.map(p => p.id === postId ? res.data : p))
    } catch (err) { console.error(err) }
  }

  const sortedPosts = [...posts].sort((a, b) => {
    if (sort === 'new') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sort === 'top') return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    const score = p => (p.upvotes - p.downvotes) + (1 / ((Date.now() - new Date(p.createdAt)) / 3600000 + 2))
    return score(b) - score(a)
  })

  const accentColor = community ? communityColor(community.name) : '#6366f1'

  if (loading) return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .spin{animation:spin 1s linear infinite}`}</style>
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg className="spin" style={{ width: 26, height: 26 }} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" style={{ opacity: 0.2 }}/>
          <path fill="white" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.6 }}/>
        </svg>
      </div>
    </>
  )

  if (!community) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@400;500&display=swap');`}</style>
      <div style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans', sans-serif" }}>
        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: 'rgba(255,255,255,0.07)', letterSpacing: '0.16em', marginBottom: 16 }}>Sphere</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 8 }}>Community not found</p>
        <Link to="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none', marginTop: 8 }}>← Back to Home</Link>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { from{left:-100%} to{left:150%} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulseGlow { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .spin { animation:spin 1s linear infinite; }

        .cd-page {
          min-height: 100vh;
          background: #080808;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Banner ── */
        .cd-banner {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cd-banner-bg {
          position: absolute; inset: 0;
          opacity: 0.12;
          background: radial-gradient(ellipse 80% 100% at 20% 50%, var(--accent), transparent 70%);
          pointer-events: none;
        }
        .cd-banner-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .cd-banner-inner {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 24px 28px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        .cd-banner-left { display: flex; align-items: center; gap: 18px; }

        /* Community icon */
        .cd-icon {
          width: 60px; height: 60px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; font-weight: 700; color: #fff;
          flex-shrink: 0;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }
        .cd-icon::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
        }

        .cd-community-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 22px; font-weight: 700;
          color: #fff; letter-spacing: -0.02em;
          margin-bottom: 5px;
        }
        .cd-desc {
          font-size: 13px; color: rgba(255,255,255,0.38);
          line-height: 1.55; max-width: 480px;
          margin-bottom: 8px;
        }
        .cd-stats { display: flex; align-items: center; gap: 16px; }
        .cd-stat { display: flex; align-items: center; gap: 5px; font-size: 12px; color: rgba(255,255,255,0.3); }
        .cd-stat-dot { width: 6px; height: 6px; border-radius: 50%; animation: pulseGlow 2s ease-in-out infinite; }

        /* Buttons */
        .cd-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-top: 4px; }
        .btn-post {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6); font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          text-decoration: none;
        }
        .btn-post:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.18); }

        .btn-join {
          padding: 8px 20px; border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
          cursor: pointer; border: none; transition: all 0.18s;
          position: relative; overflow: hidden;
        }
        .btn-join.join { background: #fff; color: #000; }
        .btn-join.join::before { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(0,0,0,0.07),transparent); }
        .btn-join.join:hover::before { animation: shimmer 0.5s ease forwards; }
        .btn-join.join:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(255,255,255,0.18); }
        .btn-join.leave { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
        .btn-join.leave:hover { background: rgba(244,63,94,0.1); border-color: rgba(244,63,94,0.3); color: #f43f5e; }
        .btn-join:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Main layout ── */
        .cd-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 860px) { .cd-main { grid-template-columns: 1fr; } .cd-aside { display: none; } }

        /* ── Sort bar ── */
        .sort-bar {
          display: flex; align-items: center; gap: 3px;
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px; padding: 5px 6px; margin-bottom: 12px;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both;
        }
        .sort-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 7px;
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.32); transition: background 0.15s, color 0.15s;
        }
        .sort-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.75); }
        .sort-btn.active { background: rgba(255,255,255,0.09); color: #fff; }

        /* ── Post cards ── */
        .pc {
          display: flex;
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; margin-bottom: 8px; overflow: hidden;
          animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both;
          transition: border-color 0.15s, background 0.15s;
          border-left: 2px solid transparent;
        }
        .pc:hover {
          border-color: rgba(255,255,255,0.13);
          border-left-color: var(--accent);
          background: rgba(255,255,255,0.032);
        }

        /* Vote col */
        .vc {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 12px 8px; min-width: 46px; flex-shrink: 0;
          background: rgba(255,255,255,0.015); border-right: 1px solid rgba(255,255,255,0.05);
        }
        .vb { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 5px; background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.25); transition: color 0.15s, background 0.15s; }
        .vb.up:hover { color: #22c55e; background: rgba(34,197,94,0.1); }
        .vb.dn:hover { color: #f43f5e; background: rgba(244,63,94,0.1); }
        .vs { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5); line-height: 1; }

        /* Post body */
        .pb { flex: 1; padding: 11px 13px; min-width: 0; }
        .pm { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; margin-bottom: 6px; }
        .mau { font-size: 11px; color: rgba(255,255,255,0.38); text-decoration: none; display:inline-flex; align-items:center; gap:4px; transition: color 0.15s; }
        .mau:hover { color: rgba(255,255,255,0.72); }
        .mdt { font-size: 11px; color: rgba(255,255,255,0.18); }
        .mby { font-size: 11px; color: rgba(255,255,255,0.22); }
        .msep { color: rgba(255,255,255,0.12); font-size: 11px; }

        .ptitle { display: block; font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.88); text-decoration: none; line-height: 1.4; letter-spacing: -0.01em; margin-bottom: 5px; transition: color 0.15s; }
        .ptitle:hover { color: #fff; }
        .pexc { font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px; }

        .pacts { display: flex; align-items: center; gap: 2px; }
        .pact { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 6px; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.25); text-decoration: none; transition: color 0.15s, background 0.15s; }
        .pact:hover { color: rgba(255,255,255,0.72); background: rgba(255,255,255,0.05); }

        /* ── Empty state ── */
        .empty { text-align: center; padding: 60px 0; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }

        /* ── Widgets (aside) ── */
        .wgt { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; margin-bottom: 10px; overflow: hidden; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .wgt-hdr { padding: 9px 12px 7px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .wgt-ttl { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
        .wgt-bd { padding: 10px 12px 12px; }

        .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .info-row:last-child { border-bottom: none; }
        .info-lbl { font-size: 12px; color: rgba(255,255,255,0.28); }
        .info-val { font-size: 12px; color: rgba(255,255,255,0.65); font-weight: 500; }

        .rules-row { padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.04); display: flex; gap: 8px; }
        .rules-row:last-child { border-bottom: none; }
        .rule-num { font-size: 11px; font-weight: 600; color: var(--accent); flex-shrink: 0; width: 16px; }
        .rule-txt { font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.5; }
      `}</style>

      <div className="cd-page" style={{ '--accent': accentColor }}>

        {/* ── Banner ── */}
        <div className="cd-banner">
          <div className="cd-banner-bg" style={{ '--accent': accentColor }} />
          <div className="cd-banner-noise" />
          <div className="cd-banner-inner">
            <div className="cd-banner-left">
              <div className="cd-icon" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}>
                {community.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="cd-community-name">s/{community.name}</h1>
                {community.description && <p className="cd-desc">{community.description}</p>}
                <div className="cd-stats">
                  <span className="cd-stat">
                    <span className="cd-stat-dot" style={{ background: accentColor }} />
                    {community.memberCount} members
                  </span>
                  <span className="cd-stat">
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                    {posts.length} posts
                  </span>
                </div>
              </div>
            </div>

            <div className="cd-actions">
              <Link to="/create-post" className="btn-post">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                Post
              </Link>
              <button
                className={`btn-join ${community.joined ? 'leave' : 'join'}`}
                onClick={handleJoin}
                disabled={joining}
              >
                {joining ? '...' : community.joined ? 'Leave' : 'Join'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="cd-main">

          {/* ── Feed ── */}
          <div>
            {/* Sort */}
            <div className="sort-bar">
              {SORT_OPTIONS.map(s => (
                <button key={s.key} className={`sort-btn${sort === s.key ? ' active' : ''}`} onClick={() => setSort(s.key)}>
                  {s.icon}{s.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            {sortedPosts.length === 0 ? (
              <div className="empty">
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: 'rgba(255,255,255,0.07)', letterSpacing: '0.16em', marginBottom: 14 }}>s/{community.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>No posts yet</p>
                <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 13, marginBottom: 20 }}>Be the first to post in this community</p>
                <Link to="/create-post" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:9, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.55)', fontSize:12, textDecoration:'none', transition:'background 0.15s, color 0.15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.11)';e.currentTarget.style.color='#fff';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='rgba(255,255,255,0.55)';}}
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Create a post
                </Link>
              </div>
            ) : (
              sortedPosts.map((post, i) => (
                <div key={post.id} className="pc" style={{ animationDelay: `${0.04 + i * 0.03}s` }}>
                  {/* Vote */}
                  <div className="vc">
                    <button className="vb up" onClick={() => handleVote(post.id, 'UPVOTE')}>
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7"/></svg>
                    </button>
                    <span className="vs">{post.upvotes - post.downvotes}</span>
                    <button className="vb dn" onClick={() => handleVote(post.id, 'DOWNVOTE')}>
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
                    </button>
                  </div>
                  {/* Body */}
                  <div className="pb">
                    <div className="pm">
                      <span className="mby">Posted by</span>
                      <Link to={`/profile/${post.authorUsername}`} className="mau">
                        <img src={post.authorAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorUsername}`} style={{ width: 13, height: 13, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} alt="" />
                        u/{post.authorUsername}
                      </Link>
                      <span className="msep">·</span>
                      <span className="mdt">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <Link to={`/post/${post.id}`} className="ptitle">{post.title}</Link>
                    {post.content && <p className="pexc">{post.content}</p>}
                    <div className="pacts">
                      <Link to={`/post/${post.id}`} className="pact">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                        {post.commentCount ?? 0} Comments
                      </Link>
                      <button className="pact" onClick={() => navigator.clipboard?.writeText(window.location.origin + `/post/${post.id}`)}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Aside ── */}
          <div className="cd-aside">

            {/* About */}
            <div className="wgt" style={{ animationDelay: '0.08s' }}>
              <div className="wgt-hdr"><span className="wgt-ttl">About</span></div>
              <div className="wgt-bd">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>s/{community.name}</p>
                    {community.description && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2, lineHeight: 1.5 }}>{community.description}</p>}
                  </div>
                </div>

                <div className="info-row"><span className="info-lbl">Members</span><span className="info-val">{community.memberCount}</span></div>
                <div className="info-row"><span className="info-lbl">Posts</span><span className="info-val">{posts.length}</span></div>
                <div className="info-row"><span className="info-lbl">Status</span><span className="info-val" style={{ color: community.joined ? '#22c55e' : 'rgba(255,255,255,0.65)' }}>{community.joined ? 'Joined ✓' : 'Not joined'}</span></div>

                <button
                  onClick={handleJoin}
                  disabled={joining}
                  style={{ display:'block', width:'100%', textAlign:'center', marginTop:14, padding:'9px 0', borderRadius:9, border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, transition:'all 0.18s', background: community.joined ? 'rgba(244,63,94,0.08)' : '#fff', color: community.joined ? '#f43f5e' : '#000', border: community.joined ? '1px solid rgba(244,63,94,0.2)' : 'none' }}
                >
                  {joining ? '...' : community.joined ? 'Leave Community' : 'Join Community'}
                </button>
              </div>
            </div>

            {/* Community rules placeholder */}
            <div className="wgt" style={{ animationDelay: '0.13s' }}>
              <div className="wgt-hdr"><span className="wgt-ttl">Community Rules</span></div>
              <div className="wgt-bd">
                {['Be respectful to all members', 'No spam or self-promotion', 'Stay on topic', 'Follow Sphere\'s content policy'].map((rule, i) => (
                  <div key={i} className="rules-row">
                    <span className="rule-num">{i + 1}</span>
                    <span className="rule-txt">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Create post CTA */}
            <Link to="/create-post" style={{ display:'block', textAlign:'center', padding:'10px 0', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.4)', fontSize:12, fontWeight:500, textDecoration:'none', transition:'background 0.15s, color 0.15s, border-color 0.15s', fontFamily:"'DM Sans',sans-serif" }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.09)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='rgba(255,255,255,0.14)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='rgba(255,255,255,0.4)';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';}}
            >
              + Create a Post
            </Link>

          </div>
        </div>
      </div>
    </>
  )
}