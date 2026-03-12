import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    number: '01',
    title: 'Communities',
    desc: 'Create and join communities around anything. Your interests, your space, your rules.',
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    number: '02',
    title: 'Real-time DMs',
    desc: 'Live messaging powered by WebSockets. Your conversations happen instantly, always.',
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    number: '03',
    title: 'Sphere AI',
    desc: 'An intelligent assistant built into every page. Summarize, explore, and understand content instantly.',
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    number: '04',
    title: 'Trending & Discovery',
    desc: 'Surface the best content across every community. Hot, new, rising — always something worth seeing.',
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    number: '05',
    title: 'Secure Auth',
    desc: 'Google OAuth, email OTP verification, and JWT sessions. Your account is always protected.',
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    number: '06',
    title: 'Live News Feed',
    desc: 'Stay informed with a dedicated news section, curated and always up to date.',
  },
]

export default function About() {
  const [visible, setVisible] = useState({})
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const sectionRefs = useRef([])

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const observers = []
    sectionRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible(v => ({ ...v, [i]: true }))
        },
        { threshold: 0.12 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const ref = (i) => (el) => { sectionRefs.current[i] = el }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Outfit:wght@200;300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes lineExpand {
          from { width: 0; }
          to   { width: 60px; }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes borderFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .ab-page {
          min-height: 100vh;
          background: #030303;
          font-family: 'Outfit', sans-serif;
          color: #fff;
          overflow-x: hidden;
        }

        /* ══════════════════════════════
           HERO
        ══════════════════════════════ */
        .ab-hero {
          position: relative;
          height: 100vh;
          min-height: 680px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
        }

        .ab-video-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .ab-video-wrap video {
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.4;
          filter: grayscale(100%);
        }
        .ab-video-wrap::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(
            175deg,
            rgba(3,3,3,0.2) 0%,
            rgba(3,3,3,0.5) 50%,
            rgba(3,3,3,0.97) 100%
          );
        }

        /* Noise grain overlay */
        .ab-hero::before {
          content: '';
          position: absolute; inset: 0; z-index: 1;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
          pointer-events: none;
        }

        .ab-hero-content {
          position: relative; z-index: 2;
          padding: 0 7vw 80px;
          max-width: 900px;
        }

        .ab-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 6px 14px;
          margin-bottom: 28px;
          opacity: ${heroLoaded ? 1 : 0};
          animation: ${heroLoaded ? 'fadeLeft 0.7s cubic-bezier(0.16,1,0.3,1) both 0.1s' : 'none'};
        }
        .ab-hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #fff;
          animation: pulse 2s infinite;
        }
        .ab-hero-badge-text {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
        }

        .ab-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(58px, 8vw, 118px);
          font-weight: 400;
          line-height: 0.92;
          letter-spacing: -0.02em;
          color: #fff;
          opacity: ${heroLoaded ? 1 : 0};
          animation: ${heroLoaded ? 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) both 0.2s' : 'none'};
        }
        .ab-hero-title em {
          font-style: italic;
          color: rgba(255,255,255,0.45);
        }

        .ab-hero-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          margin-top: 40px;
          flex-wrap: wrap;
          opacity: ${heroLoaded ? 1 : 0};
          animation: ${heroLoaded ? 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) both 0.5s' : 'none'};
        }

        .ab-hero-sub {
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
          max-width: 380px;
        }

        .ab-hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .ab-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #000;
          padding: 12px 22px; border-radius: 8px;
          font-size: 13px; font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .ab-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(255,255,255,0.15);
        }

        .ab-btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.3);
          font-size: 13px; font-weight: 400;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .ab-btn-ghost:hover { color: rgba(255,255,255,0.8); }

        /* Scroll line */
        .ab-scroll-line {
          position: absolute;
          bottom: 0; left: 7vw;
          z-index: 2;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          opacity: ${heroLoaded ? 1 : 0};
          animation: ${heroLoaded ? 'fadeUp 1s both 1.2s' : 'none'};
        }
        .ab-scroll-line span {
          font-size: 9px; letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
          writing-mode: vertical-rl;
        }
        .ab-scroll-line-bar {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.25), transparent);
        }

        /* Ticker */
        .ab-ticker {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 2;
          border-top: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          padding: 14px 0;
          background: rgba(3,3,3,0.6);
          backdrop-filter: blur(10px);
        }
        .ab-ticker-inner {
          display: flex;
          white-space: nowrap;
          animation: ticker 30s linear infinite;
        }
        .ab-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 20px;
          padding: 0 40px;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
          font-weight: 400;
        }
        .ab-ticker-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          flex-shrink: 0;
        }

        /* ══════════════════════════════
           SHARED SECTION STYLES
        ══════════════════════════════ */
        .ab-section {
          padding: 110px 7vw;
          max-width: 1160px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ab-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          font-weight: 500;
          margin-bottom: 20px;
        }
        .ab-tag::before {
          content: '';
          display: block;
          width: 20px; height: 1px;
          background: rgba(255,255,255,0.2);
        }

        .ab-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(38px, 4.5vw, 62px);
          font-weight: 400;
          letter-spacing: -0.01em;
          color: rgba(255,255,255,0.92);
          line-height: 1.1;
          margin-bottom: 0;
        }
        .ab-section-title em {
          font-style: italic;
          color: rgba(255,255,255,0.4);
        }

        /* ══════════════════════════════
           MISSION
        ══════════════════════════════ */
        .ab-mission-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
          margin-top: 60px;
        }
        @media (max-width: 760px) {
          .ab-mission-layout { grid-template-columns: 1fr; gap: 40px; }
        }

        .ab-mission-left {}

        .ab-mission-body {
          font-size: 15px;
          line-height: 2;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
          margin-top: 28px;
        }

        .ab-mission-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          overflow: hidden;
          margin-top: 36px;
        }
        .ab-stat {
          padding: 24px 22px;
          background: #060606;
        }
        .ab-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 400;
          color: rgba(255,255,255,0.8);
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 6px;
        }
        .ab-stat-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          font-weight: 400;
        }

        .ab-mission-right {
          padding-top: 10px;
        }

        .ab-manifesto {
          border-left: 1px solid rgba(255,255,255,0.08);
          padding-left: 32px;
        }
        .ab-manifesto-quote {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 2.5vw, 28px);
          font-weight: 400;
          font-style: italic;
          line-height: 1.65;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.01em;
          margin-bottom: 32px;
        }

        .ab-mission-principles {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 32px;
        }
        .ab-principle {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .ab-principle-num {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.2);
          font-weight: 500;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .ab-principle-text {
          font-size: 13px;
          line-height: 1.7;
          color: rgba(255,255,255,0.38);
          font-weight: 300;
        }
        .ab-principle-text strong {
          color: rgba(255,255,255,0.65);
          font-weight: 500;
          display: block;
          margin-bottom: 3px;
          font-size: 12px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* ══════════════════════════════
           FEATURES
        ══════════════════════════════ */
        .ab-features-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .ab-features-count {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          font-style: italic;
          color: rgba(255,255,255,0.2);
          flex-shrink: 0;
          align-self: flex-end;
          padding-bottom: 6px;
        }

        .ab-features-list {
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }

        .ab-feat-row {
          display: grid;
          grid-template-columns: 60px 1fr auto;
          align-items: center;
          gap: 24px;
          padding: 26px 32px;
          background: #060606;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: default;
          transition: background 0.25s;
          position: relative;
          overflow: hidden;
        }
        .ab-feat-row:last-child { border-bottom: none; }
        .ab-feat-row::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 0;
          background: rgba(255,255,255,0.025);
          transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-feat-row:hover { background: rgba(255,255,255,0.025); }
        .ab-feat-row:hover::before { width: 100%; }

        .ab-feat-num {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          font-style: italic;
          color: rgba(255,255,255,0.15);
          letter-spacing: 0.05em;
          position: relative; z-index: 1;
        }

        .ab-feat-main {
          position: relative; z-index: 1;
        }
        .ab-feat-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }
        .ab-feat-icon-sm {
          color: rgba(255,255,255,0.3);
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .ab-feat-row:hover .ab-feat-icon-sm { color: rgba(255,255,255,0.7); }
        .ab-feat-name {
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.75);
          letter-spacing: -0.01em;
          transition: color 0.2s;
        }
        .ab-feat-row:hover .ab-feat-name { color: rgba(255,255,255,0.95); }
        .ab-feat-desc-row {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.25);
          font-weight: 300;
          max-width: 480px;
          transition: color 0.2s;
        }
        .ab-feat-row:hover .ab-feat-desc-row { color: rgba(255,255,255,0.4); }

        .ab-feat-arrow {
          color: rgba(255,255,255,0.1);
          transition: color 0.2s, transform 0.2s;
          position: relative; z-index: 1;
          flex-shrink: 0;
        }
        .ab-feat-row:hover .ab-feat-arrow {
          color: rgba(255,255,255,0.4);
          transform: translateX(3px);
        }

        @media (max-width: 640px) {
          .ab-feat-row { grid-template-columns: 40px 1fr; padding: 20px 20px; }
          .ab-feat-arrow { display: none; }
        }

        /* ══════════════════════════════
           FOUNDER (unchanged)
        ══════════════════════════════ */
        .ab-founder-card {
          display: flex;
          align-items: flex-start;
          gap: 40px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 40px;
          margin-top: 48px;
          flex-wrap: wrap;
        }
        .ab-founder-avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 400;
          color: rgba(255,255,255,0.4);
        }
        .ab-founder-name {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 400;
          letter-spacing: 0.02em;
          color: rgba(255,255,255,0.85);
          margin-bottom: 4px;
        }
        .ab-founder-role {
          font-size: 11px; letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
          margin-bottom: 18px;
        }
        .ab-founder-bio {
          font-size: 14px; line-height: 1.85;
          color: rgba(255,255,255,0.35);
          font-weight: 300; max-width: 520px;
        }

        /* ══════════════════════════════
           CTA SECTION
        ══════════════════════════════ */
        .ab-cta-section {
          position: relative; overflow: hidden; padding: 0;
        }
        .ab-cta-video {
          position: absolute; inset: 0; z-index: 0;
        }
        .ab-cta-video video {
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.25;
          filter: grayscale(100%);
        }
        .ab-cta-video::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(3,3,3,0.75);
        }
        .ab-cta-inner {
          position: relative; z-index: 1;
          text-align: center; padding: 120px 7vw;
        }
        .ab-cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 6vw, 80px);
          font-weight: 400;
          letter-spacing: -0.01em;
          color: rgba(255,255,255,0.9);
          margin-bottom: 14px;
          line-height: 1.05;
        }
        .ab-cta-sub {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 20px; font-weight: 400;
          color: rgba(255,255,255,0.28);
          margin-bottom: 44px;
        }
        .ab-cta-btns {
          display: flex; align-items: center;
          justify-content: center; gap: 14px; flex-wrap: wrap;
        }
        .ab-btn-white {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #000;
          padding: 13px 28px; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ab-btn-white:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(255,255,255,0.18); }
        .ab-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.5);
          padding: 13px 28px; border-radius: 10px;
          font-size: 13px; font-weight: 400;
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          transition: border-color 0.2s, color 0.2s;
        }
        .ab-btn-outline:hover { border-color: rgba(255,255,255,0.45); color: rgba(255,255,255,0.9); }

        /* ══════════════════════════════
           FOOTER
        ══════════════════════════════ */
        .ab-footer {
          padding: 24px 7vw;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .ab-footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 400;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
        }
        .ab-footer-copy {
          font-size: 11px; color: rgba(255,255,255,0.15);
        }

        @media (max-width: 768px) {
          .ab-hero-content { padding: 0 6vw 90px; }
          .ab-hero-bottom { flex-direction: column; align-items: flex-start; gap: 24px; }
          .ab-founder-card { flex-direction: column; padding: 28px; gap: 20px; }
          .ab-section { padding: 72px 6vw; }
        }
      `}</style>

      <div className="ab-page">

        {/* ══ HERO ══ */}
        <section className="ab-hero">
          <div className="ab-video-wrap">
            <video autoPlay muted loop playsInline>
              <source src="/video3.webm" type="video/webm" />
            </video>
          </div>

          <div className="ab-hero-content">
            <div className="ab-hero-badge">
              <div className="ab-hero-badge-dot" />
              <span className="ab-hero-badge-text">About Sphere</span>
            </div>

            <h1 className="ab-hero-title">
              Where every<br />
              community <em>belongs.</em>
            </h1>

            <div className="ab-hero-bottom">
              <p className="ab-hero-sub">
                A platform built for genuine connection where people choose their spaces, find their people, and share what actually matters.
              </p>
              <div className="ab-hero-actions">
                <Link to="/register" className="ab-btn-primary">
                  Get started
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/" className="ab-btn-ghost">
                  Explore →
                </Link>
              </div>
            </div>
          </div>

          {/* Ticker */}
          <div className="ab-ticker">
            <div className="ab-ticker-inner">
              {[...Array(2)].map((_, ri) => (
                ['Communities', 'Real-time DMs', 'Sphere AI', 'Trending', 'Secure Auth', 'Live News', 'Open Platform', 'Built for People'].map((item, i) => (
                  <span key={`${ri}-${i}`} className="ab-ticker-item">
                    {item}
                    <span className="ab-ticker-dot" />
                  </span>
                ))
              ))}
            </div>
          </div>
        </section>

        {/* ══ MISSION ══ */}
        <section ref={ref(0)} className={`ab-section${visible[0] ? ' visible' : ''}`}>
          <div className="ab-tag">Our Mission</div>
          <h2 className="ab-section-title">
            Built for people,<br />
            not <em>algorithms.</em>
          </h2>

          <div className="ab-mission-layout">
            <div className="ab-mission-left">
              <p className="ab-mission-body">
                Sphere is a community platform built for genuine connection. Not an algorithm that decides what you see — but a space where you choose your communities, find your people, and share what matters.
                <br /><br />
                We believe the internet is better when people have real ownership over their spaces. Sphere puts communities first — giving every group the tools they need to grow, discuss, and thrive.
              </p>

              <div className="ab-mission-stats">
                <div className="ab-stat">
                  <div className="ab-stat-num">∞</div>
                  <div className="ab-stat-label">Communities</div>
                </div>
                <div className="ab-stat">
                  <div className="ab-stat-num">RT</div>
                  <div className="ab-stat-label">Real-time</div>
                </div>
                <div className="ab-stat">
                  <div className="ab-stat-num">0</div>
                  <div className="ab-stat-label">Ads. Ever.</div>
                </div>
                <div className="ab-stat">
                  <div className="ab-stat-num">AI</div>
                  <div className="ab-stat-label">Built-in</div>
                </div>
              </div>
            </div>

            <div className="ab-mission-right">
              <div className="ab-manifesto">
                <p className="ab-manifesto-quote">
                  "Every community has a story. Sphere is where those stories live — unfiltered, uncurated, undiluted."
                </p>

                <div className="ab-mission-principles">
                  <div className="ab-principle">
                    <span className="ab-principle-num">I</span>
                    <div className="ab-principle-text">
                      <strong>Community First</strong>
                      Your communities are yours. Build them, shape them, own them.
                    </div>
                  </div>
                  <div className="ab-principle">
                    <span className="ab-principle-num">II</span>
                    <div className="ab-principle-text">
                      <strong>Real Connections</strong>
                      No engagement bait. No dark patterns. Just people and conversations that matter.
                    </div>
                  </div>
                  <div className="ab-principle">
                    <span className="ab-principle-num">III</span>
                    <div className="ab-principle-text">
                      <strong>Always Evolving</strong>
                      Sphere grows with its communities — built by one person, shaped by everyone.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section ref={ref(1)} className={`ab-section${visible[1] ? ' visible' : ''}`} style={{ paddingTop: 0 }}>
          <div className="ab-features-header">
            <div>
              <div className="ab-tag">What We Built</div>
              <h2 className="ab-section-title">
                Everything you need.<br />
                <em>Nothing you don't.</em>
              </h2>
            </div>
            <span className="ab-features-count">6 features</span>
          </div>

          <div className="ab-features-list">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="ab-feat-row"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <span className="ab-feat-num">{f.number}</span>
                <div className="ab-feat-main">
                  <div className="ab-feat-title-row">
                    <span className="ab-feat-icon-sm">{f.icon}</span>
                    <span className="ab-feat-name">{f.title}</span>
                  </div>
                  <p className="ab-feat-desc-row">{f.desc}</p>
                </div>
                <svg className="ab-feat-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FOUNDER ══ */}
        <section ref={ref(2)} className={`ab-section${visible[2] ? ' visible' : ''}`} style={{ paddingTop: 0 }}>
          <div className="ab-tag">The Builder</div>
          <h2 className="ab-section-title">Meet the <em>founders.</em></h2>

          <div className="ab-founder-card">
            <div className="ab-founder-avatar">S</div>
            <div>
              <p className="ab-founder-name">Sumeet</p>
              <p className="ab-founder-role">Founder · Full-Stack Engineer</p>
              <p className="ab-founder-bio">
                Built Sphere from scratch — design to deployment. Every pixel, every API, every WebSocket connection. Sumeet set out to build the kind of community platform he actually wanted to use.
                <br /><br />
                No shortcuts, no templates. Just a clear vision and the determination to ship it.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 20,
            background: 'rgba(255,255,255,0.015)',
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '28px 40px', marginTop: 12,
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.15)">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, letterSpacing: '0.02em', color: 'rgba(255,255,255,0.25)' }}>Co-founder</p>
                <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)', padding: '3px 9px', borderRadius: 20 }}>Coming Soon</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', fontWeight: 300, letterSpacing: '0.03em' }}>The story isn't complete yet.</p>
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section ref={ref(3)} className={`ab-cta-section${visible[3] ? ' visible' : ''}`} style={{ opacity: visible[3] ? 1 : 0, transition: 'opacity 0.7s' }}>
          <div className="ab-cta-video">
            <video autoPlay muted loop playsInline>
              <source src="/video3.webm" type="video/webm" />
            </video>
          </div>
          <div className="ab-cta-inner">
            <h2 className="ab-cta-title">Join the Sphere.</h2>
            <p className="ab-cta-sub">Your world is waiting.</p>
            <div className="ab-cta-btns">
              <Link to="/register" className="ab-btn-white">
                Create an account
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/login" className="ab-btn-outline">Sign in →</Link>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="ab-footer">
          <span className="ab-footer-logo">Sphere</span>
          <span className="ab-footer-copy">© 2026 Sphere, Inc. All rights reserved.</span>
        </footer>

      </div>
    </>
  )
}