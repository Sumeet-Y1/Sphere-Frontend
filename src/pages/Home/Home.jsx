import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const communityColor = (name = '') => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#06b6d4']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

const SORT_OPTIONS = [
  { key: 'hot', label: 'Hot', icon: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.6-7C14 5 15.929 5.777 17 7c1.487 1.306 2 3 2 4a8 8 0 01-2.343 7.657z" /></svg> },
  { key: 'new', label: 'New', icon: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { key: 'top', label: 'Top', icon: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
  { key: 'rising', label: 'Rising', icon: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> },
]

export default function Home() {
  const [posts, setPosts] = useState([])
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('hot')
  const [search, setSearch] = useState('')
  const { user } = useAuth()

  useEffect(() => { fetchPosts(); fetchCommunities() }, [])

  const fetchPosts = async () => {
    try { const res = await api.get('/posts'); setPosts(res.data) }
    catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchCommunities = async () => {
    try { const res = await api.get('/communities'); setCommunities(res.data) }
    catch (err) { console.error(err) }
  }

  const handleVote = async (postId, voteType) => {
    try {
      const res = await api.post(`/posts/${postId}/vote?voteType=${voteType}`)
      setPosts(posts.map(p => p.id === postId ? res.data : p))
    } catch (err) { console.error(err) }
  }

  const joinedCommunities = communities.filter(c => c.joined)
  const topCommunities = [...communities].sort((a, b) => b.memberCount - a.memberCount).slice(0, 8)
  const trendingPosts = [...posts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 4)

  const sortedPosts = [...posts].sort((a, b) => {
    if (sort === 'new') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sort === 'top') return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    if (sort === 'rising') return (b.commentCount ?? 0) - (a.commentCount ?? 0)
    const score = p => (p.upvotes - p.downvotes) + (1 / ((Date.now() - new Date(p.createdAt)) / 3600000 + 2))
    return score(b) - score(a)
  })

  const filteredPosts = search.trim()
    ? sortedPosts.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.authorUsername?.toLowerCase().includes(search.toLowerCase()) ||
        p.communityName?.toLowerCase().includes(search.toLowerCase())
      )
    : sortedPosts

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { from { left:-100%; } to { left:150%; } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }

        .hs {
          position: fixed;
          top: 56px; left: 0; right: 0; bottom: 0;
          display: flex;
          flex-direction: column;
          background: #080808;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .sr {
          flex-shrink: 0;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: #080808;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sw { position: relative; flex: 1; max-width: 640px; margin: 0 auto; }
        .si { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.25); pointer-events: none; }
        .sinp {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 8px 14px 8px 38px;
          color: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .sinp::placeholder { color: rgba(255,255,255,0.2); }
        .sinp:focus { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.06); }

        .hc { flex: 1; display: flex; overflow: hidden; }

        .cf {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 14px 14px 60px 274px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.07) transparent;
          background: #080808;
        }
        .cf::-webkit-scrollbar { width: 3px; }
        .cf::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        .cf-inner { max-width: 680px; margin: 0 auto; }

        .rs {
          flex-shrink: 0; width: 260px;
          overflow-y: auto; overflow-x: hidden;
          border-left: 1px solid rgba(255,255,255,0.05);
          scrollbar-width: none; background: #080808;
        }
        .rs::-webkit-scrollbar { display: none; }
        .rs-inner { padding: 14px 12px 24px; }

        .wgt {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; margin-bottom: 10px; overflow: hidden;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .wgt-hdr { padding: 9px 12px 7px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .wgt-ttl { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
        .wgt-bd { padding: 8px 10px 10px; }

        .btn-cp {
          display: block; width: 100%; text-align: center; text-decoration: none;
          background: #fff; color: #000;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
          padding: 10px; border-radius: 9px; border: none; cursor: pointer;
          position: relative; overflow: hidden; margin-bottom: 10px;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .btn-cp:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,255,255,0.16); }

        .sort-bar {
          display: flex; align-items: center; gap: 3px;
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px; padding: 5px 6px; margin-bottom: 10px;
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

        .cbox {
          display: flex; align-items: center; gap: 9px;
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 9px 12px; margin-bottom: 10px;
          text-decoration: none; cursor: pointer; transition: border-color 0.15s;
        }
        .cbox:hover { border-color: rgba(255,255,255,0.14); }
        .fav { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; object-fit: cover; }
        .ginp { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 7px 11px; font-size: 13px; color: rgba(255,255,255,0.2); pointer-events: none; font-family: 'DM Sans',sans-serif; }
        .cib { padding: 6px 9px; border-radius: 7px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.3); cursor: pointer; display:flex; align-items:center; transition: background 0.15s; }
        .cib:hover { background: rgba(255,255,255,0.08); }

        .pc {
          display: flex;
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; margin-bottom: 8px; overflow: hidden;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
          transition: border-color 0.15s, background 0.15s;
        }
        .pc:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.032); }

        .vc {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 12px 8px; min-width: 46px; flex-shrink: 0;
          background: rgba(255,255,255,0.015); border-right: 1px solid rgba(255,255,255,0.05);
        }
        .vb { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 5px; background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.25); transition: color 0.15s, background 0.15s; }
        .vb.up:hover { color: #22c55e; background: rgba(34,197,94,0.1); }
        .vb.dn:hover { color: #f43f5e; background: rgba(244,63,94,0.1); }
        .vs { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5); line-height: 1; }

        .pb { flex: 1; padding: 11px 13px; min-width: 0; }
        .pm { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; margin-bottom: 6px; }

        .cchip { display: flex; align-items: center; gap: 4px; text-decoration: none; padding: 2px 7px 2px 4px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.04); transition: border-color 0.15s, background 0.15s; }
        .cchip:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.07); }
        .cchip-dot { width: 13px; height: 13px; border-radius: 4px; flex-shrink: 0; }
        .cchip-name { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.65); }

        .msep { color: rgba(255,255,255,0.12); font-size: 11px; }
        .mby { font-size: 11px; color: rgba(255,255,255,0.25); }
        .mau { font-size: 11px; color: rgba(255,255,255,0.38); text-decoration: none; display:inline-flex; align-items:center; gap:4px; transition: color 0.15s; }
        .mau:hover { color: rgba(255,255,255,0.72); }
        .mdt { font-size: 11px; color: rgba(255,255,255,0.18); }

        .ptitle { display: block; font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.88); text-decoration: none; line-height: 1.4; letter-spacing: -0.01em; margin-bottom: 5px; transition: color 0.15s; }
        .ptitle:hover { color: #fff; }
        .pexc { font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px; }

        .pacts { display: flex; align-items: center; gap: 2px; }
        .pact { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 6px; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.25); text-decoration: none; transition: color 0.15s, background 0.15s; }
        .pact:hover { color: rgba(255,255,255,0.72); background: rgba(255,255,255,0.05); }

        .tr { display: flex; gap: 10px; padding: 8px 0; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.04); transition: opacity 0.15s; }
        .tr:last-child { border-bottom: none; }
        .tr:hover { opacity: 0.65; }
        .tr-num { font-size: 17px; font-weight: 300; color: rgba(255,255,255,0.1); font-family: 'Cormorant Garamond', serif; min-width: 14px; line-height: 1.1; }
        .tr-ttl { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.5; }
        .tr-meta { font-size: 10px; color: rgba(255,255,255,0.2); margin-top: 3px; }

        .cr { display: flex; align-items: center; gap: 8px; padding: 6px 0; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.04); transition: opacity 0.15s; overflow: hidden; }
        .cr:last-child { border-bottom: none; }
        .cr:hover { opacity: 0.65; }
        .cdot { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .cr-name { font-size: 12px; color: rgba(255,255,255,0.55); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
        .cr-ct { font-size: 10px; color: rgba(255,255,255,0.2); flex-shrink: 0; }

        .va { display: block; text-align: center; margin-top: 9px; font-size: 11px; color: rgba(255,255,255,0.2); text-decoration: none; letter-spacing: 0.04em; transition: color 0.15s; }
        .va:hover { color: rgba(255,255,255,0.55); }

        .sfoot { padding: 14px 10px 8px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 4px; }
        .sfoot-links { display: flex; flex-wrap: wrap; gap: 5px 9px; margin-bottom: 8px; }
        .sfoot-link { font-size: 11px; color: rgba(255,255,255,0.2); text-decoration: none; transition: color 0.15s; }
        .sfoot-link:hover { color: rgba(255,255,255,0.5); }
        .sfoot-copy { font-size: 10px; color: rgba(255,255,255,0.1); }

        .empty { text-align: center; padding: 48px 0; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }

        @media (max-width: 1100px) { .rs { display: none; } }
      `}</style>

      <div className="hs">

        {/* Search row */}
        <div className="sr">
          <div className="sw">
            <svg className="si" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input className="sinp" placeholder="Search posts, communities, users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Main area */}
        <div className="hc">

          {/* CENTER FEED */}
          <div className="cf">
            <div className="cf-inner">

              {/* Create box */}
              <Link to="/create-post" className="cbox">
                <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} className="fav" alt="" />
                <div className="ginp">What's on your mind?</div>
                <button className="cib"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
                <button className="cib"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></button>
              </Link>

              {/* Sort */}
              <div className="sort-bar">
                {SORT_OPTIONS.map(s => (
                  <button key={s.key} className={`sort-btn${sort === s.key ? ' active' : ''}`} onClick={() => setSort(s.key)}>
                    {s.icon}{s.label}
                  </button>
                ))}
              </div>

              {/* Posts */}
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                  <svg className="spin" style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" style={{ opacity: 0.2 }} />
                    <path fill="white" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.6 }} />
                  </svg>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="empty">
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: 'rgba(255,255,255,0.07)', letterSpacing: '0.16em', marginBottom: 12 }}>Sphere</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontWeight: 500, marginBottom: 5 }}>{search ? 'No results found' : 'Nothing here yet'}</p>
                  <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 13 }}>{search ? 'Try a different keyword' : 'Be the first to post.'}</p>
                </div>
              ) : filteredPosts.map((post, i) => {
                const color = communityColor(post.communityName || '')
                return (
                  <div key={post.id} className="pc" style={{ animationDelay: `${0.04 + i * 0.03}s` }}>
                    <div className="vc">
                      <button className="vb up" onClick={() => handleVote(post.id, 'UPVOTE')}>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <span className="vs">{post.upvotes - post.downvotes}</span>
                      <button className="vb dn" onClick={() => handleVote(post.id, 'DOWNVOTE')}>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>
                    <div className="pb">
                      <div className="pm">
                        <Link to={`/community/${post.communityName}`} className="cchip">
                          <div className="cchip-dot" style={{ background: color }} />
                          <span className="cchip-name">s/{post.communityName}</span>
                        </Link>
                        <span className="msep">·</span>
                        <span className="mby">Posted by</span>
                        <Link to={`/profile/${post.authorUsername}`} className="mau">
                          <img src={post.authorAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorUsername}`} style={{ width: 13, height: 13, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} alt="" />
                          u/{post.authorUsername}
                        </Link>
                        <span className="mdt">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <Link to={`/post/${post.id}`} className="ptitle">{post.title}</Link>
                      {post.content && <p className="pexc">{post.content}</p>}
                      <div className="pacts">
                        <Link to={`/post/${post.id}`} className="pact">
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                          {post.commentCount ?? 0} Comments
                        </Link>
                        <button className="pact" onClick={() => navigator.clipboard?.writeText(window.location.origin + `/post/${post.id}`)}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="rs">
            <div className="rs-inner">

              <Link to="/create-post" className="btn-cp">+ Create Post</Link>

              {trendingPosts.length > 0 && (
                <div className="wgt" style={{ animationDelay: '0.07s' }}>
                  <div className="wgt-hdr"><span className="wgt-ttl">Trending Today</span></div>
                  <div className="wgt-bd">
                    {trendingPosts.map((post, i) => (
                      <Link key={post.id} to={`/post/${post.id}`} className="tr">
                        <span className="tr-num">{i + 1}</span>
                        <div><p className="tr-ttl">{post.title}</p><p className="tr-meta">↑ {post.upvotes} · s/{post.communityName}</p></div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {topCommunities.length > 0 && (
                <div className="wgt" style={{ animationDelay: '0.12s' }}>
                  <div className="wgt-hdr"><span className="wgt-ttl">Top Communities</span></div>
                  <div className="wgt-bd">
                    {topCommunities.map(c => (
                      <Link key={c.id} to={`/community/${c.name}`} className="cr">
                        <div className="cdot" style={{ background: communityColor(c.name) }}>{c.name.charAt(0).toUpperCase()}</div>
                        <span className="cr-name">s/{c.name}</span>
                        <span className="cr-ct">{c.memberCount}</span>
                      </Link>
                    ))}
                    <Link to="/communities" className="va">View all →</Link>
                  </div>
                </div>
              )}

              <div className="wgt" style={{ animationDelay: '0.17s' }}>
                <div className="wgt-bd" style={{ paddingTop: 13 }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.14em', marginBottom: 7 }}>Sphere</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', lineHeight: 1.7, marginBottom: 13 }}>Your world, your communities. Share ideas, join conversations, and find your people.</p>
                  <Link to="/create-post"
                    style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)', padding: '8px 0', borderRadius: 8, fontSize: 12, textDecoration: 'none', transition: 'background 0.2s, color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                  >Create a post</Link>
                </div>
              </div>

              <div className="sfoot">
                <div className="sfoot-links">
                  
                  <Link to="/about" className="sfoot-link">About</Link>
{['Help', 'Careers', 'Privacy', 'Terms', 'Rules', 'Blog'].map(l => <a key={l} href="#" className="sfoot-link">{l}</a>)}
               
               
                </div>
                <p className="sfoot-copy">Sphere, Inc. © 2026. All rights reserved.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}