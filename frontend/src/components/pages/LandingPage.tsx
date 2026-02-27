import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const SHOWCASE_ITEMS = [
  { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up - AI Enhanced" },
  { id: "9bZkp7q19f0", title: "Gangnam Style - Adaptive Remix" },
  { id: "hT_nvWreIhg", title: "One Dance - AI Vocal Blend" },
  { id: "7wtfhZwyrcc", title: "Believer - Synthwave AI Reimagining" },
  { id: "kJQP7kiw5Fk", title: "Despacito - AI Cultural Fusion" },
];

function getYtThumbnail(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

const SOCIAL_ICONS = [
  {
    name: "YouTube",
    class: "si-yt",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <rect width="48" height="48" rx="12" fill="#FF0000" />
        <path d="M38.5 17.5C38.2 16.1 37.1 15.1 35.8 14.8C33.4 14.2 24 14.2 24 14.2C24 14.2 14.6 14.2 12.2 14.8C10.9 15.1 9.8 16.2 9.5 17.5C9 19.9 9 25 9 25C9 25 9 30.1 9.5 32.5C9.8 33.9 10.9 34.9 12.2 35.2C14.6 35.8 24 35.8 24 35.8C24 35.8 33.4 35.8 35.8 35.2C37.1 34.9 38.2 33.8 38.5 32.5C39 30.1 39 25 39 25C39 25 39 19.9 38.5 17.5ZM21.2 29.5V20.5L29.2 25L21.2 29.5Z" fill="white" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    class: "si-tiktok",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <rect width="48" height="48" rx="12" fill="#010101" />
        <path d="M32.5 14.8C31.3 13.5 30.6 11.8 30.6 10H26.5V29.3C26.5 31.2 24.9 32.7 23 32.7C21.1 32.7 19.5 31.2 19.5 29.3C19.5 27.4 21 25.9 23 25.9C23.4 25.9 23.7 26 24 26.1V21.9C23.7 21.9 23.4 21.8 23 21.8C18.7 21.8 15.3 25.2 15.3 29.4C15.3 33.6 18.7 37 23 37C27.3 37 30.7 33.6 30.7 29.4V19.4C32.3 20.5 34.2 21.2 36.2 21.2V17.1C34.7 17.1 33.4 16.1 32.5 14.8Z" fill="white" />
        <path d="M32.5 14.8C33.4 16.1 34.7 17.1 36.2 17.1V17.1C35.3 17.1 34.4 16.8 33.7 16.3C33.1 15.7 32.7 15.3 32.5 14.8Z" fill="#EE1D52" />
        <path d="M30.6 10H26.5V10.2C27.7 10.2 28.9 10.7 29.7 11.5C30 11.8 30.3 12.3 30.6 12.8V10H30.6Z" fill="#EE1D52" />
        <path d="M23 21.8C23.4 21.8 23.7 21.9 24 21.9V17.8C23.7 17.8 23.3 17.7 23 17.7C18.7 17.7 15.3 21.1 15.3 25.3H15.3C15.3 23.2 16.2 21.3 17.7 20C19 18.7 20.9 17.9 23 17.9V21.8C22.8 21.8 22.5 21.8 22.3 21.9C22.5 21.9 22.8 21.8 23 21.8Z" fill="#69C9D0" />
        <path d="M30.7 29.4C30.7 33.6 27.3 37 23 37C20.8 37 18.8 36.1 17.4 34.6C18.8 36.4 20.8 37.5 23 37.5C27.3 37.5 30.7 34.1 30.7 29.9V20C31.9 20.8 33.1 21.2 34.4 21.2H36.2V17.1H36.2C34.2 17.1 32.3 16.4 30.7 15.3V29.4Z" fill="#69C9D0" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    class: "si-insta",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <defs>
          <radialGradient id="ig-g1" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#ffd879" />
            <stop offset="10%" stopColor="#ffd879" />
            <stop offset="50%" stopColor="#f56040" />
            <stop offset="70%" stopColor="#e1306c" />
            <stop offset="100%" stopColor="#833ab4" />
          </radialGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#ig-g1)" />
        <rect x="13" y="13" width="22" height="22" rx="6" stroke="white" strokeWidth="2.5" fill="none" />
        <circle cx="24" cy="24" r="5.5" stroke="white" strokeWidth="2.5" fill="none" />
        <circle cx="31.5" cy="16.5" r="1.5" fill="white" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    class: "si-linkedin",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <rect width="48" height="48" rx="12" fill="#0A66C2" />
        <path d="M16 19.5H12V36H16V19.5ZM14 17.8C12.7 17.8 11.8 16.9 11.8 15.9C11.8 14.9 12.8 14 14 14C15.3 14 16.2 14.9 16.2 15.9C16.2 16.9 15.3 17.8 14 17.8ZM37 36H33V27.9C33 24.4 29.5 24.7 29.5 27.9V36H25.5V19.5H29.5V21.8C31.3 18.5 37 18.3 37 24.6V36Z" fill="white" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    class: "si-facebook",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <rect width="48" height="48" rx="12" fill="#1877F2" />
        <path d="M33 24C33 19 29 15 24 15C19 15 15 19 15 24C15 28.4 18.2 32 22.4 33V26.6H20V24H22.4V22C22.4 19.6 23.8 18.4 26 18.4C27 18.4 28.1 18.6 28.1 18.6V20.9H26.9C25.8 20.9 25.4 21.5 25.4 22.2V24H28L27.5 26.6H25.4V33C29.8 32 33 28.4 33 24Z" fill="white" />
      </svg>
    ),
  },
];

const FEATURE_PILLS = [
  { icon: "ðŸ§ ", label: "Adaptive Learning" },
  { icon: "ðŸŽ¨", label: "Multi-Modal Generation" },
  { icon: "ðŸ“–", label: "Creative Memory" },
  { icon: "âœ¨", label: "Style Adaptation" },
  { icon: "ðŸŒ", label: "Context-Aware AI" },
  { icon: "ðŸŽ­", label: "Tone Alignment" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [creativeVision, setCreativeVision] = useState("");
  const [activeItem, setActiveItem] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  // Auto-cycle active items preview
  useEffect(() => {
    const id = setInterval(() => {
      setActiveItem((v) => (v + 1) % SHOWCASE_ITEMS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const handleStartCoCreating = () => {
    navigate("/app/text", { state: { vision: creativeVision } });
  };

  return (
    <div className="landing-root">
      {/* â”€â”€ dot-grid background â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="lp-bg-dots" aria-hidden="true" />

      {/* â”€â”€ Side Shorts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="lp-side-short lp-side-left">
        <iframe
          src="https://www.youtube.com/embed/tPEE9ZwTnG0?autoplay=1&mute=1&loop=1&playlist=tPEE9ZwTnG0&controls=0"
          title="Left Short"
          allow="autoplay"
        />
      </div>
      <div className="lp-side-short lp-side-right">
        <iframe
          src="https://www.youtube.com/embed/fC7oUOUEk8E?autoplay=1&mute=1&loop=1&playlist=fC7oUOUEk8E&controls=0"
          title="Right Short"
          allow="autoplay"
        />
      </div>

      {/* â”€â”€ floating social icons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="social-float si-yt-wrap" aria-hidden="true">
        <div className="social-badge si-yt">{SOCIAL_ICONS[0].svg}</div>
      </div>
      <div className="social-float si-tiktok-wrap" aria-hidden="true">
        <div className="social-badge si-tiktok">{SOCIAL_ICONS[1].svg}</div>
      </div>
      <div className="social-float si-insta-wrap" aria-hidden="true">
        <div className="social-badge si-insta">{SOCIAL_ICONS[2].svg}</div>
      </div>
      <div className="social-float si-li-wrap" aria-hidden="true">
        <div className="social-badge si-li">{SOCIAL_ICONS[3].svg}</div>
      </div>
      <div className="social-float si-fb-wrap" aria-hidden="true">
        <div className="social-badge si-fb">{SOCIAL_ICONS[4].svg}</div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• NAV â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-logo">
            <span className="lp-logo-icon">â–¶</span>
            <span>CHHAYA</span>
          </Link>
          <nav className="lp-nav-links">
            <Link to="/app">Dashboard</Link>
            <Link to="/app/text">Text</Link>
            <Link to="/app/image">Image</Link>
            <Link to="/app/audio">Audio</Link>
          </nav>
          <div className="lp-nav-cta">
            <Link className="lp-ghost" to="/app">Enter Studio</Link>
            <Link className="lp-btn" to="/app">Get Started</Link>
          </div>
        </div>
      </header>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• HERO â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="lp-hero">
        <p className="lp-kicker">ADAPTIVE GENERATIVE AI PLATFORM</p>
        <h1 className="lp-headline">
          <span className="gradient-text">Adaptive Creative</span><br />
          <span className="gradient-text">Content Generation</span>
        </h1>
        <p className="lp-sub">
          Your co-creative partner for music, visuals, and stories.
          <em>CHHAYA</em> evolves with your unique creative signature.
        </p>

        {/* Input bar */}
        <div className="lp-input-bar">
          <span className="lp-input-icon">âœ¨</span>
          <input
            type="text"
            placeholder="Describe your creative vision (e.g., A cyberpunk poem)"
            value={creativeVision}
            onChange={(e) => setCreativeVision(e.target.value)}
            aria-label="Describe your vision"
            className="lp-input"
          />
          <span className="lp-clip-icon">ðŸ“Ž</span>
          <button className="lp-create-btn" onClick={handleStartCoCreating}>
            Start Co-creating
          </button>
        </div>

        {/* â”€â”€ Active item preview â”€â”€ */}
        <div className="lp-yt-featured">
          <div className="lp-yt-featured-thumb">
            <img
              src={getYtThumbnail(SHOWCASE_ITEMS[activeItem].id)}
              alt={SHOWCASE_ITEMS[activeItem].title}
              className="lp-yt-thumb-img"
            />
            <div className="lp-yt-overlay">
              <span className="lp-play-btn">â–¶</span>
            </div>
          </div>
        </div>

        <div className="lp-yt-rail-wrap">
          <div className="lp-yt-rail" ref={railRef}>
            {SHOWCASE_ITEMS.map((v: { id: string; title: string }, i: number) => (
              <button
                key={v.id}
                className={`lp-yt-card${activeItem === i ? " lp-yt-card--active" : ""}`}
                onClick={() => setActiveItem(i)}
                aria-label={`Preview ${v.title}`}
              >
                <img
                  src={getYtThumbnail(v.id)}
                  alt={v.title}
                  className="lp-yt-card-img"
                  loading="lazy"
                />
                <div className="lp-yt-card-overlay">
                  <span className="lp-yt-views">
                    <span className="lp-views-label">{v.title}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• FEATURE PILLS â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="lp-features-bar">
        {FEATURE_PILLS.map((p) => (
          <span key={p.label} className="lp-pill">
            <span className="lp-pill-icon">{p.icon}</span>
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
// commit sync 1
// commit sync 2
// commit sync 3
// commit sync 4
// commit sync 5
// commit sync 6
// commit sync 7
// commit sync 8
// commit sync 9
// commit sync 10
// commit sync 11
// commit sync 12
// commit sync 13
// commit sync 14
// commit sync 15
// commit sync 16
// commit sync 17
// commit sync 18
// commit sync 19
// commit sync 20
// commit sync 21
// commit sync 22
// commit sync 23
// commit sync 24
// commit sync 25
// commit sync 26
// commit sync 27
