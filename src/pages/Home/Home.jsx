import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts')
      setPosts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (postId, voteType) => {
    try {
      const res = await api.post(`/posts/${postId}/vote?voteType=${voteType}`)
      setPosts(posts.map(p => p.id === postId ? res.data : p))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
      <div style={{
        minHeight: '100vh', background: '#080808',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <svg className="spin" style={{ width: 28, height: 28, color: 'rgba(255,255,255,0.3)' }} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" style={{ opacity: 0.2 }} />
          <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.7 }} />
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
        @keyframes spin { to { transform: rotate(360deg); } }

        .home-wrap {
          min-height: 100vh;
          background: #080808;
          font-family: 'DM Sans', sans-serif;
        }

        .home-inner {
          max-width: 680px;
          margin: 0 auto;
          padding: 32px 20px 64px;
        }

        /* ── Create post box ── */
        .create-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 28px;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both;
          transition: border-color 0.2s;
        }
        .create-box:hover { border-color: rgba(255,255,255,0.12); }

        .create-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
          display: block;
        }

        .create-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          padding: 10px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.25);
          text-decoration: none;
          display: block;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          letter-spacing: 0.01em;
        }
        .create-input:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.4);
        }

        /* ── Empty state ── */
        .empty-state {
          text-align: center;
          padding: 80px 0;
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        .empty-logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 52px;
          color: rgba(255,255,255,0.08);
          letter-spacing: 0.16em;
          margin-bottom: 20px;
        }
        .empty-title {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
        }
        .empty-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.2);
        }

        /* ── Post card ── */
        .post-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 12px;
          transition: border-color 0.2s, background 0.2s;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        .post-card:hover {
          border-color: rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.035);
        }

        /* Post header */
        .post-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .post-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .post-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .post-author {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }
        .post-author:hover { color: #fff; }
        .post-in {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
        }
        .post-community {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
          background: rgba(255,255,255,0.05);
          padding: 2px 8px;
          border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .post-community:hover { color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.15); }
        .post-date {
          font-size: 11px;
          color: rgba(255,255,255,0.18);
          font-family: 'DM Sans', sans-serif;
        }

        /* Post body */
        .post-title {
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.88);
          text-decoration: none;
          display: block;
          margin-bottom: 7px;
          line-height: 1.45;
          letter-spacing: -0.01em;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }
        .post-title:hover { color: #fff; }
        .post-body {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Thin rule */
        .post-rule {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 14px 0;
        }

        /* Post footer actions */
        .post-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 8px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
          letter-spacing: 0.01em;
        }
        .action-btn:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.05);
        }
        .action-btn.upvote:hover { color: rgba(180,255,180,0.85); }
        .action-btn.downvote:hover { color: rgba(255,160,160,0.85); }
        .action-icon { width: 14px; height: 14px; flex-shrink: 0; }

        .action-sep {
          width: 1px;
          height: 14px;
          background: rgba(255,255,255,0.06);
          margin: 0 2px;
          flex-shrink: 0;
        }
      `}</style>

      <div className="home-wrap">
        <div className="home-inner">

          {/* Create post */}
          <div className="create-box">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
              className="create-avatar"
              alt=""
            />
            <Link to="/create-post" className="create-input">
              What's on your mind?
            </Link>
          </div>

          {/* Empty state */}
          {posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-logo">Sphere</div>
              <p className="empty-title">Nothing here yet</p>
              <p className="empty-sub">Be the first to post something.</p>
            </div>
          ) : (
            <div>
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  className="post-card"
                  style={{ animationDelay: `${0.06 + i * 0.05}s` }}
                >
                  {/* Header */}
                  <div className="post-header">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorUsername}`}
                      className="post-avatar"
                      alt=""
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="post-meta-row">
                        <Link to={`/profile/${post.authorUsername}`} className="post-author">
                          {post.authorUsername}
                        </Link>
                        <span className="post-in">in</span>
                        <Link to={`/community/${post.communityName}`} className="post-community">
                          s/{post.communityName}
                        </Link>
                      </div>
                      <div style={{ marginTop: '3px' }}>
                        <span className="post-date">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <Link to={`/post/${post.id}`} className="post-title">{post.title}</Link>
                  {post.content && (
                    <p className="post-body">{post.content}</p>
                  )}

                  {/* Divider */}
                  <div className="post-rule" />

                  {/* Actions */}
                  <div className="post-actions">
                    <button
                      className="action-btn upvote"
                      onClick={() => handleVote(post.id, 'UPVOTE')}
                    >
                      <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      {post.upvotes}
                    </button>

                    <button
                      className="action-btn downvote"
                      onClick={() => handleVote(post.id, 'DOWNVOTE')}
                    >
                      <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {post.downvotes}
                    </button>

                    <div className="action-sep" />

                    <Link to={`/post/${post.id}`} className="action-btn">
                      <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.commentCount}
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}