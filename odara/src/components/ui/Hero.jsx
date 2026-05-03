"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Countdown timer ───────────────────────────────────────────────────────────
function useCountdown(initialSeconds = 15771) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 86400)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ── Carousel slides ───────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    badge: "Exclusive Launch",
    headline: "Africa's Finest,",
    headlineAccent: "Delivered to You.",
    body: "Discover a marketplace where premium African craftsmanship meets modern vitality. Up to 40% off on featured collections.",
    cta: "Shop Collection",
    ctaHref: "/shop",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b984b?w=900&q=80&fit=crop&crop=top",
    accent: "#E8520A",
  },
  {
    id: 2,
    badge: "New Arrivals",
    headline: "Ankara & Aso-oke",
    headlineAccent: "Ready to Wear.",
    body: "Handcrafted by skilled Nigerian artisans. Explore our latest collection of authentic Ankara prints and Aso-oke weaves.",
    cta: "Explore Fashion",
    ctaHref: "/category/fashion",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=900&q=80&fit=crop&crop=center",
    accent: "#0F7B4E",
  },
  {
    id: 3,
    badge: "Beauty & Wellness",
    headline: "Nature's Best",
    headlineAccent: "From Africa.",
    body: "Shea butter, black soap, argan oil and more. 100% natural, ethically sourced beauty essentials from across the continent.",
    cta: "Shop Beauty",
    ctaHref: "/category/beauty",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80&fit=crop&crop=faces",
    accent: "#7B3FA0",
  },
  {
    id: 4,
    badge: "Flash Sale",
    headline: "Artisan Crafts",
    headlineAccent: "Up to 50% Off.",
    body: "Beaded jewellery, woven baskets, hand-carved wood décor — celebrate Africa's rich artistic heritage in your home.",
    cta: "See Flash Deals",
    ctaHref: "/deals",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94816a5?w=900&q=80&fit=crop",
    accent: "#C9860A",
  },
];

export default function Hero() {
  const countdown = useCountdown(15771);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  // Auto-play
  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

        .hero-root {
          font-family: 'DM Sans', sans-serif;
          background: #F7F5F2;
          padding: 20px 24px;
        }
        .hero-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 16px;
          align-items: stretch;
        }

        /* ── Main carousel ── */
        .hero-carousel {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          min-height: 390px;
          background: #1a0a00;
          cursor: pointer;
        }
        .carousel-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
          display: flex;
          align-items: flex-end;
        }
        .carousel-slide.active { opacity: 1; z-index: 2; }
        .carousel-slide img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }
        .carousel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, rgba(10,4,0,0.85) 0%, rgba(10,4,0,0.5) 48%, rgba(10,4,0,0.05) 100%);
        }
        .carousel-content {
          position: relative;
          z-index: 3;
          padding: 36px 40px;
          max-width: 500px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          transition: background 0.4s;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: #fff;
          border-radius: 50%;
          animation: blink 1.4s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.3; }
        }
        .hero-headline {
          font-family: 'Sora', sans-serif;
          font-size: 2.05rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }
        .hero-headline-accent { display: block; }
        .hero-body {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.76);
          line-height: 1.65;
          margin: 0 0 26px;
          max-width: 380px;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          padding: 12px 26px;
          border-radius: 8px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: filter 0.2s, transform 0.15s;
        }
        .hero-cta:hover { filter: brightness(1.12); transform: translateY(-1px); }
        .hero-cta svg { transition: transform 0.2s; }
        .hero-cta:hover svg { transform: translateX(3px); }

        /* Prev / Next arrows */
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: background 0.2s;
        }
        .carousel-arrow:hover { background: rgba(255,255,255,0.32); }
        .carousel-arrow.prev { left: 14px; }
        .carousel-arrow.next { right: 14px; }

        /* Dots */
        .carousel-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          gap: 7px;
        }
        .carousel-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .carousel-dot.active {
          background: #fff;
          transform: scale(1.3);
          
        }

        /* Progress bar */
        .carousel-progress {
          position: absolute;
          bottom: 0; left: 0;
          height: 3px;
          z-index: 10;
          border-radius: 0 3px 3px 0;
          transition: background 0.4s;
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .carousel-progress.running {
          animation: progressFill 5s linear;
        }

        /* ── Side column ── */
        .hero-side {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Merchant card */
        .side-card-merchant {
          background: #fff;
          border-radius: 16px;
          padding: 22px;
          border: 1px solid #EDE9E3;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .side-icons-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .side-icon-box {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .side-eyebrow {
          font-family: 'Sora', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: #1A0A00;
          margin: 0 0 6px;
        }
        .side-body {
          font-size: 0.8rem;
          color: #6B5E52;
          line-height: 1.55;
          margin: 0 0 18px;
          flex: 1;
        }
        .side-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Sora', sans-serif;
          font-size: 0.8125rem;
          font-weight: 700;
          color: #E8520A;
          text-decoration: none;
          transition: gap 0.2s;
        }
        .side-cta:hover { gap: 10px; }

        /* Daily deals card */
        .side-card-deals {
          background: #FEF0E6;
          border-radius: 16px;
          padding: 20px 22px;
          border: 1px solid #FDDFC9;
        }
        .deals-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .deals-label {
          font-family: 'Sora', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: #A83800;
          margin: 0;
        }
        .deals-live-badge {
          background: #E8520A;
          color: #fff;
          font-size: 0.56rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          font-family: 'Sora', sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .deals-sub {
          font-size: 0.77rem;
          color: #8B5240;
          margin: 0 0 12px;
          line-height: 1.5;
        }
        .deals-chips {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
        }
        .deals-chip {
          flex: 1;
          background: #fff;
          border-radius: 8px;
          padding: 7px 10px;
          border: 1px solid #FDDFC9;
        }
        .chip-name { font-size: 0.67rem; color: #6B5E52; margin-bottom: 2px; }
        .chip-off {
          font-size: 0.78rem;
          font-weight: 700;
          color: #A83800;
          font-family: 'Sora', sans-serif;
        }
        .deals-divider { height: 1px; background: #FDDFC9; margin-bottom: 12px; }
        .deals-timer-row { display: flex; align-items: center; gap: 8px; }
        .deals-timer-icon { color: #A83800; }
        .deals-timer {
          font-family: 'Sora', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #7C2D00;
          letter-spacing: 0.04em;
          font-variant-numeric: tabular-nums;
        }

        /* ── Trust strip ── */
        .hero-trust {
          max-width: 1280px;
          margin: 14px auto 0;
          display: flex;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.78rem;
          color: #6B5E52;
          font-weight: 500;
        }
        .trust-item svg { color: #E8520A; flex-shrink: 0; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-side { display: none; }
          .hero-carousel { min-height: 300px; }
          .carousel-content { padding: 24px 22px; }
          .hero-headline { font-size: 1.5rem; }
        }
      `}</style>

      <section className="hero-root">
        <div className="hero-grid">

          {/* ══ CAROUSEL ══ */}
          <div
            className="hero-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {SLIDES.map((s, i) => (
              <div key={s.id} className={`carousel-slide${i === current ? " active" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.headline} loading={i === 0 ? "eager" : "lazy"} />
                <div className="carousel-overlay" />
                <div className="carousel-content">
                  <div className="hero-badge" style={{ background: s.accent }}>
                    <span className="badge-dot" />
                    {s.badge}
                  </div>
                  <h1 className="hero-headline">
                    {s.headline}
                    <span className="hero-headline-accent" style={{ color: s.accent }}>
                      {s.headlineAccent}
                    </span>
                  </h1>
                  <p className="hero-body">{s.body}</p>
                  <Link href={s.ctaHref} className="hero-cta" style={{ background: s.accent }}>
                    {s.cta}
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}

            {/* Arrows */}
            <button className="carousel-arrow prev" onClick={prev} aria-label="Previous slide">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className="carousel-arrow next" onClick={next} aria-label="Next slide">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Dots */}
            <div className="carousel-dots">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot${i === current ? " active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Progress bar */}
            {!paused && (
              <div
                key={`${current}-${paused}`}
                className="carousel-progress running"
                style={{ background: slide.accent }}
              />
            )}
          </div>

          {/* ══ SIDE COLUMN ══ */}
          <div className="hero-side">

            {/* Merchant Central */}
            <div className="side-card-merchant">
              <div className="side-icons-row">
                <div className="side-icon-box" style={{ background: "#FEF0E6" }}>
                  <svg width="22" height="22" fill="none" stroke="#E8520A" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 22V12h6v10" />
                  </svg>
                </div>
                <div className="side-icon-box" style={{ background: "#F0F7EE" }}>
                  <svg width="22" height="22" fill="none" stroke="#2E7D32" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={1.8} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
                  </svg>
                </div>
                <div className="side-icon-box" style={{ background: "#EEF2FF" }}>
                  <svg width="22" height="22" fill="none" stroke="#4F46E5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <p className="side-eyebrow">Merchant Central</p>
              <p className="side-body">
                Empowering independent African creators to reach a global audience. Open your store in minutes.
              </p>
              <Link href="/sell" className="side-cta">
                Start Selling
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>

            {/* Daily Deals */}
            <div className="side-card-deals">
              <div className="deals-top-row">
                <p className="deals-label">Daily Deals</p>
                <span className="deals-live-badge">Live</span>
              </div>
              <p className="deals-sub">Fresh offers every 24 hours. Don&apos;t miss out.</p>
              <div className="deals-chips">
                {[{ label: "Ankara Sets", off: "35%" }, { label: "Shea Butter", off: "20%" }].map((d) => (
                  <div key={d.label} className="deals-chip">
                    <div className="chip-name">{d.label}</div>
                    <div className="chip-off">−{d.off}</div>
                  </div>
                ))}
              </div>
              <div className="deals-divider" />
              <div className="deals-timer-row">
                <svg className="deals-timer-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={1.8} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6l4 2" />
                </svg>
                <span className="deals-timer">{countdown}</span>
              </div>
            </div>
          </div>
        </div>

      
      </section>
    </>
  );
}