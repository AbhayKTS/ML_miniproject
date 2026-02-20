import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-root">
      <header className="hero-landing">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-top">
            <div className="logo">quickreel</div>
            <nav className="hero-nav">
              <a>Home</a>
              <a>Pricing</a>
              <a>Blog</a>
            </nav>
            <div className="hero-actions">
              <Link className="ghost-button" to="/app">
                Sign In
              </Link>
              <Link className="button-primary" to="/upload">
                Sign Up — It's Free
              </Link>
            </div>
          </div>

          <div className="hero-main">
            <div className="hero-copy">
              <div className="hero-kicker">#1 AI VIDEO CLIPPING TOOL</div>
              <h1 className="hero-title">
                Convert Your Long Video Into
                <br /> Viral Short Videos in 1 minute
              </h1>
              <p className="hero-sub">
                Create engaging and high quality clips from your long video with
                one click, by Chhaya
              </p>

              <div className="hero-cta">
                <div className="hero-input">
                  <input
                    aria-label="Paste YouTube link or upload file"
                    placeholder="Paste YouTube Link"
                  />
                  <button className="ghost-button small">📎</button>
                </div>
                <button className="button-primary">Create free clips</button>
              </div>
            </div>

            <div className="hero-preview">
              <div className="preview-rail">
                <div className="preview-large">
                  <div className="thumb big" />
                </div>
                <div className="preview-row">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div className="thumb small" key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hero-gallery">
            <div className="gallery-cards">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="vertical-card" key={i}>
                  <div className="vc-thumb" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="features-row">
        <div className="features">
          <span className="feature-pill">AI clipping</span>
          <span className="feature-pill">AI editing</span>
          <span className="feature-pill">AI captioning</span>
          <span className="feature-pill">AI B-Roll</span>
          <span className="feature-pill">AI BGM</span>
          <span className="feature-pill muted">Silence & filler word remover</span>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
