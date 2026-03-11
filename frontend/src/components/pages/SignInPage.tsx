import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api";

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await loginUser(email, password);
      localStorage.setItem("chhaya_token", result.token);
      localStorage.setItem("chhaya_user", JSON.stringify(result.user));
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Sign in failed. Please check your credentials.");
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
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to continue your creative journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <span className="auth-error-icon">⚠</span>
                {error}
              </div>
            )}

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
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  <span>Sign In</span>
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
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">Create one</Link>
            </p>
          </div>

          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-icon">🧠</span>
              <span>Creative Memory Sync</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">🎨</span>
              <span>Multi-Modal Generation</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">✨</span>
              <span>Adaptive Learning</span>
            </div>
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

export default SignInPage;
