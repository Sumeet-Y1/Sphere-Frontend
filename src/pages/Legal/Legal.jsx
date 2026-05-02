import { useState } from 'react'
import { Link } from 'react-router-dom'

const sections = [
  {
    id: 'how-we-use',
    title: 'How We Use Your Data',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),   
    content: [
      { heading: 'To provide and improve our services', body: 'We use your information to operate Sphere, personalise your experience, and improve our platform. This includes showing you relevant communities, posts, and content based on your activity.' },
      { heading: 'To communicate with you', body: 'We send you account-related emails such as OTP verification, password resets, and important service updates. We do not send marketing emails without your consent.' },
      { heading: 'To ensure safety and security', body: 'We use your data to detect and prevent fraud, abuse, spam, and other harmful activity on the platform. This helps keep Sphere safe for everyone.' },
      { heading: 'To comply with legal obligations', body: 'We may process your data when required to do so by applicable law, regulation, or legal process.' },
    ]
  },
  {
    id: 'cookies',
    title: 'Cookies',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    content: [
      { heading: 'What are cookies?', body: 'Cookies are small text files stored on your device when you visit Sphere. They help us remember your preferences, keep you logged in, and understand how you use our platform.' },
      { heading: 'Types of cookies we use', body: 'We use essential cookies (required for the platform to function), preference cookies (to remember your settings like theme), and analytics cookies (to understand usage patterns and improve the experience).' },
      { heading: 'Managing cookies', body: 'You can control and delete cookies through your browser settings. Note that disabling essential cookies may affect your ability to use certain features of Sphere.' },
      { heading: 'Third-party cookies', body: 'Some third-party services we integrate, such as Google OAuth, may set their own cookies. These are governed by the respective third-party privacy policies.' },
    ]
  },
  {
    id: 'third-party',
    title: 'Third Party Services',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    content: [
      { heading: 'Google OAuth', body: 'We offer sign-in via Google. When you use this feature, Google shares your name, email address, and profile picture with us. This is governed by Google\'s Privacy Policy.' },
      { heading: 'Amazon Web Services (AWS)', body: 'We store user-uploaded content such as profile pictures on AWS S3. AWS is a secure, industry-standard cloud storage provider. Your files are stored in compliance with AWS\'s data protection standards.' },
      { heading: 'Analytics', body: 'We may use privacy-friendly analytics tools to understand how users interact with Sphere. These tools collect aggregated, anonymised data and do not track you individually across the web.' },
      { heading: 'No data selling', body: 'Sphere does not sell, rent, or trade your personal information to third parties for their marketing purposes — ever.' },
    ]
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4 8 4s8 1.79 8 4m0 0v3" />
      </svg>
    ),
    content: [
      { heading: 'Account data', body: 'We retain your account information for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal reasons.' },
      { heading: 'Posts and comments', body: 'Content you post on Sphere is retained as long as your account exists. When you delete a post or comment, it is removed from public view immediately and purged from our servers within 7 days.' },
      { heading: 'Logs and analytics', body: 'Server logs and anonymised analytics data are retained for up to 90 days for security and performance monitoring purposes.' },
      { heading: 'Backup data', body: 'Deleted data may persist in encrypted backups for up to 30 days as part of our disaster recovery process, after which it is permanently removed.' },
    ]
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    content: [
      { heading: 'Right to access', body: 'You have the right to request a copy of the personal data we hold about you. You can access most of your data directly from your Profile and Settings pages.' },
      { heading: 'Right to correction', body: 'You can update or correct your personal information at any time through your Settings page. If you need help correcting data you cannot edit yourself, contact our support team.' },
      { heading: 'Right to deletion', body: 'You can delete your account and associated data at any time from Settings → Account. You may also contact us to request deletion of specific data.' },
      { heading: 'Right to data portability', body: 'You can request an export of your data in a machine-readable format. Contact us at privacy@sphere.com to make a data portability request.' },
      { heading: 'Right to object', body: 'You have the right to object to certain types of data processing, including direct marketing. Contact us if you wish to exercise this right.' },
    ]
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    content: [
      { heading: 'Privacy enquiries', body: 'If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact our privacy team at privacy@sphere.com.' },
      { heading: 'General support', body: 'For general account or platform support, reach out to support@sphere.com or visit our Help Center.' },
      { heading: 'Response time', body: 'We aim to respond to all privacy-related requests within 5 business days. For data deletion or portability requests, the process may take up to 30 days.' },
      { heading: 'Registered address', body: 'Sphere, Inc. — For official correspondence, please contact us via email. We will provide our registered address upon request.' },
    ]
  },
]

export default function PrivacyPolicy() {
  const [dark, setDark] = useState(false)
  const [activeSection, setActiveSection] = useState(null)

  const d = dark
  const bg = d ? '#080808' : '#f8f7f4'
  const cardBg = d ? 'rgba(255,255,255,0.02)' : '#fff'
  const cardBorder = d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const textPrimary = d ? 'rgba(255,255,255,0.85)' : '#111'
  const textSecondary = d ? 'rgba(255,255,255,0.4)' : '#666'
  const textMuted = d ? 'rgba(255,255,255,0.2)' : '#999'
  const divider = d ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
  const inputBg = d ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
  const inputBorder = d ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const hoverBg = d ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const toggleBg = d ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const toggleBorder = d ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .pp-wrap { min-height:100vh; font-family:'DM Sans',sans-serif; transition:background 0.3s; }
        .pp-container { max-width:780px; margin:0 auto; padding:0 24px 80px; }

        .pp-hero { padding:60px 24px 48px; text-align:center; position:relative; }
        .pp-logo { font-family:'Cormorant Garamond',serif; font-size:40px; font-weight:300; letter-spacing:0.14em; line-height:1; margin-bottom:8px; transition:color 0.3s; animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .pp-badge { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:99px; font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:20px; animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .pp-title { font-size:28px; font-weight:600; letter-spacing:-0.02em; margin-bottom:10px; transition:color 0.3s; animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .pp-updated { font-size:12px; transition:color 0.3s; animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both; }

        /* Dark mode toggle */
        .pp-toggle {
          position:fixed; top:20px; right:20px; z-index:100;
          display:flex; align-items:center; gap:8px;
          padding:8px 14px; border-radius:99px;
          border:1px solid; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500;
          transition:all 0.2s; backdrop-filter:blur(12px);
        }
        .pp-toggle:hover { transform:translateY(-1px); }

        /* TOC */
        .pp-toc { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:40px; animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .pp-toc-item {
          padding:7px 14px; border-radius:99px; font-size:12px; font-weight:500;
          border:1px solid; cursor:pointer; transition:all 0.18s; text-decoration:none;
          display:flex; align-items:center; gap:6px;
        }

        /* Section card */
        .pp-section {
          border-radius:16px; overflow:hidden; margin-bottom:12px;
          border:1px solid; transition:border-color 0.2s;
          animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        .pp-section-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 24px; cursor:pointer; transition:background 0.15s;
          border:none; width:100%; text-align:left; gap:12px;
        }
        .pp-section-title { font-size:15px; font-weight:600; transition:color 0.3s; }
        .pp-section-chevron { flex-shrink:0; transition:transform 0.25s, color 0.2s; }
        .pp-section-chevron.open { transform:rotate(180deg); }
        .pp-section-body { padding:0 24px 24px; animation:fadeIn 0.2s ease both; }
        .pp-section-item { padding:16px 0; border-top:1px solid; }
        .pp-section-item:first-child { border-top:none; padding-top:0; }
        .pp-item-heading { font-size:13px; font-weight:600; margin-bottom:6px; transition:color 0.3s; }
        .pp-item-body { font-size:13px; line-height:1.75; transition:color 0.3s; }

        /* Info banner */
        .pp-info {
          border-radius:14px; padding:20px 24px;
          border:1px solid; margin-bottom:32px;
          display:flex; gap:14px; align-items:flex-start;
          animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both;
        }

        /* Footer */
        .pp-footer { padding:32px 24px; border-top:1px solid; text-align:center; }
        .pp-footer-links { display:flex; flex-wrap:wrap; justify-content:center; gap:4px 18px; margin-bottom:10px; }
        .pp-footer-link { font-size:12px; text-decoration:none; transition:color 0.2s; }

        @media(max-width:600px) {
          .pp-title { font-size:22px; }
          .pp-logo { font-size:32px; }
          .pp-section-header { padding:16px 18px; }
          .pp-section-body { padding:0 18px 18px; }
          .pp-toggle { top:12px; right:12px; padding:6px 12px; }
        }
      `}</style>

      <div className="pp-wrap" style={{ background: bg }}>

        {/* Dark mode toggle */}
        <button
          className="pp-toggle"
          onClick={() => setDark(!dark)}
          style={{ background: toggleBg, borderColor: toggleBorder, color: textSecondary }}
        >
          {dark ? (
            <>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Light Mode
            </>
          ) : (
            <>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Dark Mode
            </>
          )}
        </button>

        {/* Hero */}
        <div className="pp-hero">
          <div className="pp-logo" style={{ color: textPrimary }}>Sphere</div>
          <div style={{ width: 28, height: 1, background: textMuted, margin: '10px auto 18px' }} />
          <div
            className="pp-badge"
            style={{ background: dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1', borderColor: 'rgba(99,102,241,0.2)' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#6366f1"><circle cx="5" cy="5" r="5"/></svg>
            Legal Document
          </div>
          <div className="pp-title" style={{ color: textPrimary }}>Privacy Policy</div>
          <div className="pp-updated" style={{ color: textMuted }}>Last updated: March 2026</div>
        </div>

        <div className="pp-container">

          {/* Info banner */}
          <div className="pp-info" style={{ background: dark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.15)' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6366f1" style={{ flexShrink: 0, marginTop: 1 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.7, margin: 0 }}>
              This Privacy Policy explains how Sphere, Inc. collects, uses, and protects your information when you use our platform. By using Sphere, you agree to the practices described here. If you have questions, contact us at <a href="mailto:privacy@sphere.com" style={{ color: '#6366f1', textDecoration: 'none' }}>privacy@sphere.com</a>.
            </p>
          </div>

          {/* TOC */}
          <div className="pp-toc">
            {sections.map(s => (
              <a
                key={s.id} href={`#${s.id}`}
                className="pp-toc-item"
                style={{ background: inputBg, borderColor: inputBorder, color: textSecondary }}
                onClick={e => { e.preventDefault(); setActiveSection(activeSection === s.id ? null : s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
              >
                <span style={{ color: '#6366f1' }}>{s.icon}</span>
                {s.title}
              </a>
            ))}
          </div>

          {/* Sections */}
          {sections.map((section, si) => (
            <div
              key={section.id} id={section.id}
              className="pp-section"
              style={{ background: cardBg, borderColor: activeSection === section.id ? 'rgba(99,102,241,0.3)' : cardBorder, animationDelay: `${si * 0.06}s` }}
            >
              <button
                className="pp-section-header"
                style={{ background: 'transparent', color: textPrimary }}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {section.icon}
                  </div>
                  <span className="pp-section-title" style={{ color: textPrimary }}>{section.title}</span>
                </div>
                <svg className={`pp-section-chevron${activeSection === section.id ? ' open' : ''}`} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={textMuted}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeSection === section.id && (
                <div className="pp-section-body">
                  {section.content.map((item, i) => (
                    <div key={i} className="pp-section-item" style={{ borderColor: divider }}>
                      <div className="pp-item-heading" style={{ color: textPrimary }}>{item.heading}</div>
                      <div className="pp-item-body" style={{ color: textSecondary }}>{item.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="pp-footer" style={{ borderColor: divider }}>
            <div className="pp-footer-links">
              <Link to="/" className="pp-footer-link" style={{ color: textMuted }}>Home</Link>
              <Link to="/about" className="pp-footer-link" style={{ color: textMuted }}>About</Link>
              <Link to="/help" className="pp-footer-link" style={{ color: textMuted }}>Help</Link>
              <a href="#" className="pp-footer-link" style={{ color: textMuted }}>Terms</a>
              <a href="mailto:privacy@sphere.com" className="pp-footer-link" style={{ color: textMuted }}>Contact</a>
            </div>
            <p style={{ fontSize: 11, color: textMuted }}>Sphere, Inc © {new Date().getFullYear()}. All rights reserved.</p>
          </div>

        </div>
      </div>
    </>
  )
}