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

// ── Carousel slides ── 3 images only, no text ─────────────────────────────────
const SLIDES = [
  {
    id: 1,
    image: "/img1.png",
  },
  {
    id: 2,
    image: "/img2.png",
  },
  {
    id: 3,
    image: "/img3.png",
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

        /* ── Main carousel ── original height */
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
          object-position: center;
        }

        /* Prev / Next arrows */
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 36px; height: 36px;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: background 0.2s;
        }
        .carousel-arrow:hover { background: rgba(0,0,0,0.7); }
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
          gap: 8px;
          align-items: center;
        }
        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s;
        }
        .carousel-dot.active {
          background: #fff;
          transform: scale(1.3);
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

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .hero-root {
            padding: 0;
          }
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .hero-side { display: none; }
          .hero-carousel {
            min-height: auto;
            height: auto;
            border-radius: 0;
            aspect-ratio: 16 / 9;
          }
          .carousel-slide img {
            object-fit: contain;
            background: #1a0a00;
          }
          .carousel-arrow {
            top: auto;
            transform: none;
            bottom: 12px;
            width: 30px;
            height: 30px;
          }
          .carousel-arrow.prev { left: auto; right: 52px; }
          .carousel-arrow.next { right: 14px; }
          .carousel-dots {
            bottom: 18px;
            left: 18px;
            transform: none;
          }
          .carousel-dot {
            width: 6px;
            height: 6px;
          }
          .carousel-dot.active {
            width: 18px;
            border-radius: 4px;
            transform: none;
            background: #fff;
          }
        }
      `}</style>

      <section className="hero-root">
        <div className="hero-grid">

          {/* ══ CAROUSEL — IMAGES ONLY ══ */}
          <div
            className="hero-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {SLIDES.map((s, i) => (
              <div key={s.id} className={`carousel-slide${i === current ? " active" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={`Slide ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
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