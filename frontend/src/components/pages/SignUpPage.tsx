import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await registerUser(name, email, password);
      localStorage.setItem("chhaya_token", result.token);
      localStorage.setItem("chhaya_user", JSON.stringify(result.user));
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* Background effects */}
      <div className="auth-bg-dots" aria-hidden="true" />
      <div className="auth-bg-glow" aria-hidden="true" />

      {/* Header */}
      <header className="auth-header">
        <Link to="/" className="auth-logo">
          <span className="auth-logo-icon">▶</span>
          <span>CHHAYA</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Join CHHAYA and start co-creating</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <span className="auth-error-icon">⚠</span>
                {error}
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="name" className="auth-label">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email" className="auth-label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password" className="auth-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="auth-btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-alt-actions">
            <p className="auth-alt-text">
              Already have an account?{" "}
              <Link to="/signin" className="auth-link">Sign in</Link>
            </p>
          </div>

          <div className="auth-benefits">
            <h3 className="auth-benefits-title">What you'll get</h3>
            <ul className="auth-benefits-list">
              <li>
                <span className="auth-benefit-icon">🎭</span>
                <span><strong>Adaptive Engine</strong> — AI that learns your creative style</span>
              </li>
              <li>
                <span className="auth-benefit-icon">🧠</span>
                <span><strong>Creative Memory</strong> — Your preferences, remembered</span>
              </li>
              <li>
                <span className="auth-benefit-icon">🎨</span>
                <span><strong>Multi-Modal</strong> — Text, image, and audio generation</span>
              </li>
              <li>
                <span className="auth-benefit-icon">📹</span>
                <span><strong>Video Clipping</strong> — Auto-detect highlights from long videos</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <p>© 2026 CHHAYA ADAPTIVE — Enhancing Creative Content Generation</p>
      </footer>
    </div>
  );
};

export default SignUpPage;
