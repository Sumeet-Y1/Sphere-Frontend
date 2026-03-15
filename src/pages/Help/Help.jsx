import { useState } from 'react'
import { Link } from 'react-router-dom'

const categories = [
  {
    id: 'getting-started',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Getting Started',
    desc: 'New to Sphere? Start here.',
    color: '#6366f1',
    faqs: [
      { q: 'What is Sphere?', a: 'Sphere is a community platform where you can join or create communities around any topic, share ideas, and connect with people who share your interests.' },
      { q: 'How do I create an account?', a: 'Click "Register" on the login page, fill in your username, email and password, then verify your email with the OTP we send you. You can also sign up with Google.' },
      { q: 'Is Sphere free to use?', a: 'Yes! Sphere is free to join and use. We offer optional premium plans with extra features.' },
      { q: 'How do I find communities to join?', a: 'Head to the Communities page from the navbar or sidebar. You can browse all communities or search by name.' },
      { q: 'Can I use Sphere on my phone?', a: 'Absolutely. Sphere is fully responsive and works great on mobile browsers.' },
    ]
  },
  {
    id: 'account',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'Account & Profile',
    desc: 'Manage your identity on Sphere.',
    color: '#8b5cf6',
    faqs: [
      { q: 'How do I update my profile?', a: 'Go to your Profile page by clicking your avatar. Click "Edit Profile" to update your bio, avatar, and display name.' },
      { q: 'Can I change my username?', a: 'Usernames can be changed once every 30 days. Go to Settings → Profile to update it.' },
      { q: 'How do I change my password?', a: 'Go to Settings → Password. Enter your current password and your new one. If you signed up with Google, you\'ll need to set a password first.' },
      { q: 'How do I upload a profile picture?', a: 'On your Profile page, click on your avatar image to upload a new one. We support JPG, PNG, and WebP files.' },
      { q: 'How do I delete my account?', a: 'Go to Settings → Account → Delete Account. This is permanent and cannot be undone. All your posts and data will be removed.' },
    ]
  },
  {
    id: 'communities',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Communities',
    desc: 'Create, join and manage communities.',
    color: '#ec4899',
    faqs: [
      { q: 'How do I create a community?', a: 'On the Communities page, click "Create Community". Give it a name, description, and choose if it\'s public or private.' },
      { q: 'Who can post in a community?', a: 'Any member of a public community can post. In private communities, only approved members can post.' },
      { q: 'How do I become a moderator?', a: 'Community creators are automatically moderators. Creators can promote other members to moderators from the community settings.' },
      { q: 'Can I leave a community?', a: 'Yes. Go to the community page and click the "Leave" button. You can rejoin anytime.' },
      { q: 'How do I report a community?', a: 'On the community page, click the three-dot menu and select "Report Community". Our team will review it.' },
    ]
  },
  {
    id: 'privacy',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Privacy & Safety',
    desc: 'Stay safe and control your data.',
    color: '#22c55e',
    faqs: [
      { q: 'Who can see my profile?', a: 'Your profile is public by default. You can make your post history private in Settings → Privacy.' },
      { q: 'How do I block someone?', a: 'Go to their profile and click the three-dot menu, then select "Block". You can manage blocked users in Settings → Blocked.' },
      { q: 'How do I report a post or comment?', a: 'Click the three-dot menu on any post or comment and select "Report". Choose a reason and submit.' },
      { q: 'What data does Sphere collect?', a: 'We collect your email, username, and usage data to improve the platform. We never sell your personal data. Read our full Privacy Policy for details.' },
      { q: 'How do I enable two-factor authentication?', a: '2FA is coming soon! We\'re working on adding it as an extra layer of security for your account.' },
    ]
  },
  {
    id: 'billing',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: 'Billing & Plans',
    desc: 'Subscriptions, payments and upgrades.',
    color: '#f97316',
    faqs: [
      { q: 'What plans does Sphere offer?', a: 'Sphere offers a free plan for everyone. Premium plans with advanced features are coming soon.' },
      { q: 'How do I upgrade my plan?', a: 'Premium plans are not available yet. We\'ll notify you when they launch. Stay tuned!' },
      { q: 'How do I cancel my subscription?', a: 'You can cancel any active subscription from Settings → Billing → Cancel Plan. Your access continues until the end of the billing period.' },
      { q: 'What payment methods are accepted?', a: 'We will accept all major credit/debit cards and UPI when billing launches.' },
      { q: 'Will I get a refund if I cancel?', a: 'We offer a 7-day refund policy on all paid plans. Contact support if you need a refund.' },
    ]
  },
  {
    id: 'technical',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: 'Technical Issues',
    desc: 'Bugs, errors and troubleshooting.',
    color: '#14b8a6',
    faqs: [
      { q: 'The page is not loading. What do I do?', a: 'Try refreshing the page, clearing your browser cache, or switching browsers. If the issue persists, contact our support team.' },
      { q: 'I\'m not receiving the OTP email.', a: 'Check your spam/junk folder. Make sure you typed your email correctly. You can request a new OTP after 60 seconds.' },
      { q: 'My images are not uploading.', a: 'Make sure your file is under 5MB and is a JPG, PNG, or WebP format. Try a different browser if the issue continues.' },
      { q: 'Notifications are not working.', a: 'Make sure notifications are enabled in Settings → Notifications. Also check your browser notification permissions.' },
      { q: 'How do I report a bug?', a: 'Use the feedback button in the app or email us at support@sphere.com. Please include screenshots and steps to reproduce the issue.' },
    ]
  }
]

export default function Help() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)

  const filteredCategories = categories.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(f =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => !search || cat.faqs.length > 0)

  const activeData = activeCategory
    ? filteredCategories.find(c => c.id === activeCategory)
    : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .help-wrap {
          min-height: 100vh;
          background: #080808;
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 80px;
        }

        /* Hero */
        .help-hero {
          text-align: center;
          padding: 72px 24px 56px;
          position: relative;
          overflow: hidden;
        }
        .help-hero-glow {
          position: absolute;
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%);
          top: 0; left: 50%; transform: translateX(-50%);
          pointer-events: none;
        }
        .help-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px; font-weight: 300;
          color: #fff; letter-spacing: 0.12em;
          line-height: 1; margin-bottom: 12px;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both;
        }
        .help-sub {
          color: rgba(255,255,255,0.25);
          font-size: 14px; margin-bottom: 36px;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }

        /* Search */
        .help-search-wrap {
          max-width: 520px; margin: 0 auto;
          position: relative;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both;
        }
        .help-search {
          width: 100%; padding: 15px 20px 15px 48px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .help-search::placeholder { color: rgba(255,255,255,0.2); }
        .help-search:focus { border-color: rgba(255,255,255,0.3); box-shadow: 0 0 0 3px rgba(255,255,255,0.04); }
        .help-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.25); pointer-events: none; }

        /* Container */
        .help-container { max-width: 960px; margin: 0 auto; padding: 0 24px; }

        /* Category grid */
        .help-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px; margin-bottom: 48px;
        }
        .help-cat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 22px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        .help-cat-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.13); transform: translateY(-2px); }
        .help-cat-card.active { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); }
        .help-cat-icon {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 14px; flex-shrink: 0;
        }
        .help-cat-title { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.85); margin-bottom: 4px; }
        .help-cat-desc { font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.5; }
        .help-cat-count { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 10px; }

        /* FAQ section */
        .help-faq-section { animation: fadeIn 0.3s ease both; }
        .help-faq-header {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px; padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .help-back {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px; padding: 7px 14px;
          color: rgba(255,255,255,0.4); font-size: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s; display: flex; align-items: center; gap: 6px;
        }
        .help-back:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); }

        .help-faq-item {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 13px; overflow: hidden;
          margin-bottom: 10px;
          transition: border-color 0.2s;
        }
        .help-faq-item:hover { border-color: rgba(255,255,255,0.12); }
        .help-faq-item.open { border-color: rgba(255,255,255,0.14); }
        .help-faq-q {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px; background: rgba(255,255,255,0.02);
          cursor: pointer; border: none;
          color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; text-align: left; gap: 12px;
          transition: background 0.15s;
        }
        .help-faq-q:hover { background: rgba(255,255,255,0.04); }
        .help-faq-chevron { flex-shrink: 0; color: rgba(255,255,255,0.25); transition: transform 0.25s; }
        .help-faq-chevron.open { transform: rotate(180deg); color: rgba(255,255,255,0.5); }
        .help-faq-a {
          padding: 0 20px 18px;
          color: rgba(255,255,255,0.45); font-size: 13px; line-height: 1.7;
          background: rgba(255,255,255,0.02);
          animation: fadeUp 0.2s ease both;
        }

        /* All FAQs view */
        .help-all-section { margin-bottom: 36px; }
        .help-all-section-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.3); letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 12px;
        }
        .help-all-section-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* Contact banner */
        .help-contact {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 28px 32px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap; margin-top: 48px;
        }
        .help-contact-btn {
          padding: 11px 22px; border-radius: 10px;
          background: #fff; color: #000;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          border: none; cursor: pointer; white-space: nowrap;
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none; display: inline-block;
        }
        .help-contact-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,255,255,0.15); }

        /* Footer */
        .help-footer {
          margin-top: 64px; padding: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .help-footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 18px; }
        .help-footer-link { color: rgba(255,255,255,0.2); font-size: 12px; text-decoration: none; transition: color 0.2s; }
        .help-footer-link:hover { color: rgba(255,255,255,0.6); }
        .help-footer-copy { color: rgba(255,255,255,0.1); font-size: 11px; }

        @media (max-width: 600px) {
          .help-title { font-size: 36px; }
          .help-grid { grid-template-columns: 1fr; }
          .help-contact { flex-direction: column; text-align: center; }
          .help-contact-btn { width: 100%; text-align: center; }
        }
      `}</style>

      <div className="help-wrap">

        {/* Hero */}
        <div className="help-hero">
          <div className="help-hero-glow" />
          <h1 className="help-title">Help Center</h1>
          <p className="help-sub">How can we help you today?</p>

          {/* Search */}
          <div className="help-search-wrap">
            <svg className="help-search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="help-search"
              placeholder="Search for help..."
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory(null); setOpenFaq(null) }}
            />
          </div>
        </div>

        <div className="help-container">

          {/* Category cards */}
          {!activeCategory && (
            <div className="help-grid">
              {filteredCategories.map((cat, i) => (
                <div
                  key={cat.id}
                  className="help-cat-card"
                  style={{ animationDelay: `${i * 0.07}s` }}
                  onClick={() => { setActiveCategory(cat.id); setOpenFaq(null) }}
                >
                  <div className="help-cat-icon" style={{ background: `${cat.color}18`, color: cat.color }}>
                    {cat.icon}
                  </div>
                  <div className="help-cat-title">{cat.title}</div>
                  <div className="help-cat-desc">{cat.desc}</div>
                  <div className="help-cat-count">{cat.faqs.length} articles</div>
                </div>
              ))}
            </div>
          )}

          {/* Search results — show all matching FAQs grouped */}
          {search && !activeCategory && (
            <div>
              {filteredCategories.map(cat => cat.faqs.length > 0 && (
                <div key={cat.id} className="help-all-section">
                  <div className="help-all-section-title">
                    <div className="help-all-section-dot" style={{ background: cat.color }} />
                    {cat.title}
                  </div>
                  {cat.faqs.map((faq, i) => {
                    const faqId = `${cat.id}-${i}`
                    return (
                      <div key={i} className={`help-faq-item${openFaq === faqId ? ' open' : ''}`}>
                        <button className="help-faq-q" onClick={() => setOpenFaq(openFaq === faqId ? null : faqId)}>
                          <span>{faq.q}</span>
                          <svg className={`help-faq-chevron${openFaq === faqId ? ' open' : ''}`} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openFaq === faqId && <div className="help-faq-a">{faq.a}</div>}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Single category FAQs */}
          {activeCategory && activeData && (
            <div className="help-faq-section">
              <div className="help-faq-header">
                <button className="help-back" onClick={() => { setActiveCategory(null); setOpenFaq(null) }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${activeData.color}18`, color: activeData.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activeData.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{activeData.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{activeData.faqs.length} articles</div>
                  </div>
                </div>
              </div>

              {activeData.faqs.map((faq, i) => {
                const faqId = `${activeData.id}-${i}`
                return (
                  <div key={i} className={`help-faq-item${openFaq === faqId ? ' open' : ''}`}>
                    <button className="help-faq-q" onClick={() => setOpenFaq(openFaq === faqId ? null : faqId)}>
                      <span>{faq.q}</span>
                      <svg className={`help-faq-chevron${openFaq === faqId ? ' open' : ''}`} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === faqId && <div className="help-faq-a">{faq.a}</div>}
                  </div>
                )
              })}
            </div>
          )}

          {/* Contact banner */}
          <div className="help-contact">
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>Still need help?</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>Can't find what you're looking for? Our support team is here to help.</div>
            </div>
            <a href="mailto:support@sphere.com" className="help-contact-btn">Contact Support</a>
          </div>

          {/* Footer */}
          <div className="help-footer">
            <div className="help-footer-links">
              <Link to="/about" className="help-footer-link">About</Link>
              <a href="#" className="help-footer-link">Privacy</a>
              <a href="#" className="help-footer-link">Terms</a>
              <a href="#" className="help-footer-link">Careers</a>
              <a href="#" className="help-footer-link">Blog</a>
            </div>
            <p className="help-footer-copy">Sphere, Inc © {new Date().getFullYear()}. All rights reserved.</p>
          </div>

        </div>
      </div>
    </>
  )
}