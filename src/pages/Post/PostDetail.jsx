import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function PostDetail() {
  const { postId } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState(null)

  useEffect(() => {
    fetchPost()  
    fetchComments()
  }, [postId])

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${postId}`)
      setPost(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/post/${postId}`)
      setComments(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleVote = async (voteType) => {
    try {
      const res = await api.post(`/posts/${postId}/vote?voteType=${voteType}`)
      setPost(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSubmitting(true)
    try {
      await api.post('/comments', {
        postId: parseInt(postId),
        content: commentText,
        parentId: replyTo || null
      })
      setCommentText('')
      setReplyTo(null)
      fetchComments()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`)
      fetchComments()
    } catch (err) {
      console.error(err)
    }
  }

  const CommentCard = ({ comment, depth = 0 }) => (
    <div style={{ marginLeft: depth > 0 ? '20px' : '0', borderLeft: depth > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingLeft: depth > 0 ? '16px' : '0' }}>
      <div style={{ padding: '14px 0' }}>

        {/* Comment header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={comment.authorAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorUsername}`}
              style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              alt=""
            />
            <Link to={`/profile/${comment.authorUsername}`} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 500, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
            >
              {comment.authorUsername}
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11px', fontFamily: "'DM Sans', sans-serif" }}>
              {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {comment.authorUsername === user?.username && (
            <button
              onClick={() => handleDeleteComment(comment.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.18)', fontSize: '11px', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.2s', padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,100,100,0.8)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.18)'}
            >
              Delete
            </button>
          )}
        </div>

        {/* Comment body */}
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.65, marginBottom: '10px', fontFamily: "'DM Sans', sans-serif" }}>
          {comment.content}
        </p>

        {/* Reply button */}
        <button
          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', transition: 'color 0.2s', padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
        >
          {replyTo === comment.id ? 'Cancel' : 'Reply'}
        </button>

        {/* Reply input */}
        {replyTo === comment.id && (
          <form onSubmit={handleComment} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="reply-input"
              placeholder={`Reply to ${comment.authorUsername}...`}
              autoFocus
            />
            <button type="submit" disabled={submitting} className="reply-btn">
              Reply
            </button>
          </form>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.map(reply => (
        <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  )

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

  if (!post) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@400&display=swap');`}</style>
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.16em' }}>Sphere</p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Post not found</p>
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

        .pd-wrap {
          min-height: 100vh;
          background: #080808;
          font-family: 'DM Sans', sans-serif;
        }
        .pd-inner {
          max-width: 680px;
          margin: 0 auto;
          padding: 32px 20px 80px;
        }

        .post-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 12px;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both;
        }

        .comment-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both;
        }

        .comments-list {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 0 20px;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.22s both;
        }

        .comment-divider {
          height: 1px;
          background: rgba(255,255,255,0.04);
        }

        .comment-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #fff;
          padding: 11px 14px;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          outline: none;
          transition: border-color 0.22s, background 0.22s, box-shadow 0.22s;
        }
        .comment-input::placeholder { color: rgba(255,255,255,0.16); }
        .comment-input:focus {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
        }

        .reply-input {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          padding: 9px 12px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }
        .reply-input::placeholder { color: rgba(255,255,255,0.14); }
        .reply-input:focus { border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.05); }

        .comment-btn {
          background: #fff;
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 13px;
          padding: 10px 18px;
          border-radius: 9px;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .comment-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent);
        }
        .comment-btn:hover::before { animation: shimmer 0.5s ease forwards; }
        .comment-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,255,255,0.15); }
        .comment-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }

        .reply-btn {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 9px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, color 0.2s;
        }
        .reply-btn:hover { background: rgba(255,255,255,0.13); color: #fff; }
        .reply-btn:disabled { opacity: 0.35; cursor: not-allowed; }

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
          transition: color 0.15s, background 0.15s;
        }
        .action-btn:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.05); }
        .action-btn.upvote:hover { color: rgba(180,255,180,0.85); }
        .action-btn.downvote:hover { color: rgba(255,160,160,0.85); }

        .post-community {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          background: rgba(255,255,255,0.05);
          padding: 2px 8px;
          border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.07);
          transition: color 0.15s, border-color 0.15s;
        }
        .post-community:hover { color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.15); }

        .post-author {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }
        .post-author:hover { color: #fff; }

        .media-img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .media-img:hover { opacity: 0.85; }

        .lightbox-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.92);
          display: flex; align-items: center; justify-content: center;
          animation: fadeUp 0.2s ease both;
        }
        .lightbox-img {
          max-width: 90vw; max-height: 90vh;
          border-radius: 10px;
          object-fit: contain;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
        }
        .lightbox-close {
          position: absolute; top: 20px; right: 24px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          color: #fff; border-radius: 50%; width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 16px; transition: background 0.2s;
        }
        .lightbox-close:hover { background: rgba(255,255,255,0.16); }
      `}</style>

      <div className="pd-wrap">
        <div className="pd-inner">

          {/* ── Post card ── */}
          <div className="post-card">

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <img
                src={post.authorAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorUsername}`}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
                alt=""
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <Link to={`/profile/${post.authorUsername}`} className="post-author">{post.authorUsername}</Link>
                  <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11px' }}>in</span>
                  <Link to={`/community/${post.communityName}`} className="post-community">s/{post.communityName}</Link>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11px', marginTop: '3px', fontFamily: "'DM Sans', sans-serif" }}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.4, marginBottom: '12px', fontFamily: "'DM Sans', sans-serif" }}>
              {post.title}
            </h1>

            {/* Content */}
            {post.content && (
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.75, marginBottom: '20px', fontFamily: "'DM Sans', sans-serif" }}>
                {post.content}
              </p>
            )}

            {/* ── MEDIA: Photos ── */}
            {post.type === 'MEDIA' && post.mediaType === 'PHOTO' && post.mediaUrls?.length > 0 && (
              <MediaPhotoGrid urls={post.mediaUrls} />
            )}

            {/* ── MEDIA: Video ── */}
            {post.type === 'MEDIA' && post.mediaType === 'VIDEO' && post.imageUrl && (
              <div style={{ marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                <video
                  src={post.imageUrl}
                  controls
                  style={{ width: '100%', maxHeight: '420px', display: 'block', background: '#000' }}
                />
              </div>
            )}

            {/* ── IMAGE post ── */}
            {post.type === 'IMAGE' && post.imageUrl && (
              <div style={{ marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                <img src={post.imageUrl} alt="" style={{ width: '100%', display: 'block', maxHeight: '480px', objectFit: 'cover' }} />
              </div>
            )}

            {/* ── LINK post ── */}
            {post.type === 'LINK' && post.linkUrl && (
              <a
                href={post.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9px', marginBottom: '20px', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.4)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.linkUrl}
                </span>
              </a>
            )}

            {/* Rule */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 0 14px' }} />

            {/* Vote + comment count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button className="action-btn upvote" onClick={() => handleVote('UPVOTE')}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {post.upvotes}
              </button>
              <button className="action-btn downvote" onClick={() => handleVote('DOWNVOTE')}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {post.downvotes}
              </button>
              <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />
              <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", padding: '6px 10px' }}>
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </span>
            </div>
          </div>

          {/* ── Comment box ── */}
          {!replyTo && (
            <div className="comment-box">
              <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <img
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                  style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
                  alt=""
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="comment-input"
                  placeholder="Write a comment..."
                />
                <button type="submit" disabled={submitting || !commentText.trim()} className="comment-btn">
                  {submitting ? '...' : 'Post'}
                </button>
              </form>
            </div>
          )}

          {/* ── Comments list ── */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>
                  No comments yet — be the first!
                </p>
              </div>
            ) : (
              comments.map((comment, i) => (
                <div key={comment.id}>
                  <CommentCard comment={comment} />
                  {i < comments.length - 1 && <div className="comment-divider" />}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  )
}

// ── Media photo grid with lightbox ──
function MediaPhotoGrid({ urls }) {
  const [lightbox, setLightbox] = useState(null)
  const cols = Math.min(urls.length, 3)
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '6px', marginBottom: '20px', borderRadius: '10px', overflow: 'hidden' }}>
        {urls.map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            className="media-img"
            onClick={() => setLightbox(url)}
          />
        ))}
      </div>
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}