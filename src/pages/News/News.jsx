import { useState, useEffect } from 'react'
import api from '../../api/axios'

const CATEGORIES = ['general', 'technology', 'sports', 'business', 'entertainment', 'health', 'science']

const CATEGORY_ICONS = {
  general:       <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  technology:    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  sports:        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  business:      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
  entertainment: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>,
  health:        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>,
  science:       <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>,
}

const CATEGORY_COLORS = {
  general: '#6366f1', technology: '#3b82f6', sports: '#22c55e',
  business: '#eab308', entertainment: '#ec4899', health: '#f43f5e', science: '#14b8a6',
}

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('general')
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [featured, setFeatured] = useState(null)

  useEffect(() => { fetchNews() }, [category])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/news/category/${category}`)
      const data = res.data || []
      setFeatured(data[0] || null)
      setNews(data.slice(1))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) return
    setSearching(true)
    try {
      const res = await api.get(`/news/search?query=${search}`)
      const data = res.data || []
      setFeatured(data[0] || null)
      setNews(data.slice(1))
    } catch (err) { console.error(err) }
    finally { setSearching(false) }
  }

  const accent = CATEGORY_COLORS[category] || '#6366f1'

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr)
    const h = Math.floor(diff / 3600000)
    if (h < 1) return `${Math.floor(diff / 60000)}m ago`
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { from{left:-100%} to{left:150%} }
        .spin { animation:spin 1s linear infinite; }

        .news-page {
          min-height: 100vh;
          background: #080808;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header band ── */
        .news-header {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 28px 0 22px;
        }
        .news-header-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 120% at 10% 50%, var(--accent-dim), transparent 70%);
        }
        .news-header-inner {
          max-width: 1060px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .news-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px; font-weight: 300;
          color: #fff; letter-spacing: 0.08em;
        }
        .news-subtitle { font-size: 12px; color: rgba(255,255,255,0.25); margin-top: 3px; letter-spacing: 0.02em; }

        /* Search form */
        .search-form { display: flex; gap: 6px; flex-shrink: 0; }
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.25); pointer-events: none; }
        .search-inp {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px; padding: 8px 14px 8px 34px;
          color: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px;
          outline: none; width: 220px; transition: border-color 0.2s, background 0.2s;
        }
        .search-inp::placeholder { color: rgba(255,255,255,0.2); }
        .search-inp:focus { border-color: rgba(255,255,255,0.22); background: rgba(255,255,255,0.06); }
        .search-btn {
          padding: 8px 16px; border-radius: 9px; border: none;
          background: #fff; color: #000;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
          position: relative; overflow: hidden;
        }
        .search-btn::before { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(0,0,0,0.07),transparent); }
        .search-btn:hover::before { animation: shimmer 0.5s ease forwards; }
        .search-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,255,255,0.15); }
        .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Main layout ── */
        .news-body { max-width: 1060px; margin: 0 auto; padding: 20px 24px 80px; }

        /* Category pills */
        .cat-row {
          display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 20px;
          scrollbar-width: none; animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.04s both;
        }
        .cat-row::-webkit-scrollbar { display: none; }
        .cat-pill {
          display: flex; align-items: center; gap: 5px;
          flex-shrink: 0; padding: 6px 13px; border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.35); cursor: pointer;
          transition: all 0.15s; text-transform: capitalize;
        }
        .cat-pill:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.14); }
        .cat-pill.active { color: #000; border-color: transparent; font-weight: 600; }

        /* ── Featured card ── */
        .featured {
          display: flex; gap: 0;
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.025);
          margin-bottom: 16px;
          text-decoration: none;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.06s both;
          transition: border-color 0.18s, background 0.18s;
          position: relative;
        }
        .featured:hover { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.04); }
        .featured-badge {
          position: absolute; top: 12px; left: 12px;
          padding: 3px 10px; border-radius: 99px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          color: #000; z-index: 1;
        }
        .featured-img {
          width: 320px; flex-shrink: 0;
          background: rgba(255,255,255,0.04);
          overflow: hidden; position: relative;
        }
        .featured-img img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.85); transition: filter 0.25s; }
        .featured:hover .featured-img img { filter: brightness(1); }
        .featured-img-placeholder { width: 100%; height: 100%; min-height: 200px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; }
        .featured-body { flex: 1; padding: 22px 22px 18px; display: flex; flex-direction: column; justify-content: space-between; }
        .featured-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .featured-source { font-size: 11px; font-weight: 600; color: var(--accent); letter-spacing: 0.04em; }
        .featured-sep { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.15); }
        .featured-time { font-size: 11px; color: rgba(255,255,255,0.2); }
        .featured-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 400; line-height: 1.35;
          color: rgba(255,255,255,0.88); letter-spacing: 0.01em;
          margin-bottom: 10px; transition: color 0.15s;
        }
        .featured:hover .featured-title { color: #fff; }
        .featured-desc { font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .featured-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; }
        .read-more { font-size: 11px; color: var(--accent); font-weight: 600; letter-spacing: 0.04em; display: flex; align-items: center; gap: 4px; }

        /* ── Article grid ── */
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 10px;
        }

        .article-card {
          display: flex; gap: 12px;
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 12px;
          text-decoration: none;
          animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both;
          transition: border-color 0.15s, background 0.15s;
          border-left: 2px solid transparent;
        }
        .article-card:hover { border-color: rgba(255,255,255,0.13); border-left-color: var(--accent); background: rgba(255,255,255,0.035); }

        .article-img {
          width: 72px; height: 72px; border-radius: 8px; flex-shrink: 0;
          background: rgba(255,255,255,0.04); overflow: hidden;
        }
        .article-img img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.85); transition: filter 0.2s; }
        .article-card:hover .article-img img { filter: brightness(1); }
        .article-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.06); }

        .article-body { flex: 1; min-width: 0; }
        .article-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
        .article-source { font-size: 10px; font-weight: 600; color: var(--accent); letter-spacing: 0.03em; }
        .article-time { font-size: 10px; color: rgba(255,255,255,0.18); }
        .article-title {
          font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8);
          line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          transition: color 0.15s;
        }
        .article-card:hover .article-title { color: rgba(255,255,255,0.95); }
        .article-desc { font-size: 11px; color: rgba(255,255,255,0.25); line-height: 1.55; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        /* Loading / empty */
        .center-state { display: flex; align-items: center; justify-content: center; padding: 72px 0; }
        .empty-state { text-align: center; padding: 64px 0; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }

        @media (max-width: 700px) {
          .news-header-inner { flex-direction: column; align-items: flex-start; }
          .featured { flex-direction: column; }
          .featured-img { width: 100%; height: 200px; }
          .articles-grid { grid-template-columns: 1fr; }
          .search-inp { width: 160px; }
        }
      `}</style>

      <div className="news-page" style={{ '--accent': accent, '--accent-dim': accent + '22' }}>

        {/* ── Header ── */}
        <div className="news-header">
          <div className="news-header-glow" />
          <div className="news-header-inner">
            <div>
              <h1 className="news-title">News</h1>
              <p className="news-subtitle">Stay updated with the world</p>
            </div>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-wrap">
                <svg className="search-icon" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input className="search-inp" placeholder="Search news..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="search-btn" type="submit" disabled={searching}>
                {searching ? '...' : 'Search'}
              </button>
            </form>
          </div>
        </div>

        <div className="news-body">

          {/* ── Category pills ── */}
          <div className="cat-row">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-pill${category === cat ? ' active' : ''}`}
                style={category === cat ? { background: CATEGORY_COLORS[cat], boxShadow: `0 0 16px ${CATEGORY_COLORS[cat]}44` } : {}}
                onClick={() => { setCategory(cat); setSearch('') }}
              >
                {CATEGORY_ICONS[cat]}{cat}
              </button>
            ))}
          </div>

          {/* ── Loading ── */}
          {(loading || searching) ? (
            <div className="center-state">
              <svg className="spin" style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" style={{ opacity: 0.2 }}/>
                <path fill="white" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.6 }}/>
              </svg>
            </div>

          /* ── Empty ── */
          ) : news.length === 0 && !featured ? (
            <div className="empty-state">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: 'rgba(255,255,255,0.07)', letterSpacing: '0.16em', marginBottom: 14 }}>Sphere</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontWeight: 500, marginBottom: 5 }}>No news found</p>
              <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 13 }}>Try a different category or search term</p>
            </div>

          ) : (
            <>
              {/* ── Featured ── */}
              {featured && (
                <a className="featured" href={featured.url} target="_blank" rel="noopener noreferrer">
                  <span className="featured-badge" style={{ background: accent }}>Featured</span>
                  <div className="featured-img">
                    {featured.urlToImage
                      ? <img src={featured.urlToImage} alt={featured.title} onError={e => e.target.style.display='none'} />
                      : <div className="featured-img-placeholder">
                          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(255,255,255,0.08)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                        </div>
                    }
                  </div>
                  <div className="featured-body">
                    <div>
                      <div className="featured-meta">
                        <span className="featured-source">{featured.sourceName}</span>
                        <span className="featured-sep" />
                        <span className="featured-time">{timeAgo(featured.publishedAt)}</span>
                      </div>
                      <h2 className="featured-title">{featured.title}</h2>
                      {featured.description && <p className="featured-desc">{featured.description}</p>}
                    </div>
                    <div className="featured-footer">
                      <span className="read-more">
                        Read full story
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </a>
              )}

              {/* ── Articles grid ── */}
              {news.length > 0 && (
                <div className="articles-grid">
                  {news.map((article, i) => (
                    <a
                      key={i}
                      className="article-card"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ animationDelay: `${0.05 + i * 0.025}s` }}
                    >
                      <div className="article-img">
                        {article.urlToImage
                          ? <img src={article.urlToImage} alt={article.title} onError={e => e.target.parentElement.innerHTML = '<div class="article-img-placeholder"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color:rgba(255,255,255,0.06)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg></div>'} />
                          : <div className="article-img-placeholder">
                              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(255,255,255,0.06)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                            </div>
                        }
                      </div>
                      <div className="article-body">
                        <div className="article-meta">
                          <span className="article-source">{article.sourceName}</span>
                          <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                          <span className="article-time">{timeAgo(article.publishedAt)}</span>
                        </div>
                        <p className="article-title">{article.title}</p>
                        {article.description && <p className="article-desc">{article.description}</p>}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}