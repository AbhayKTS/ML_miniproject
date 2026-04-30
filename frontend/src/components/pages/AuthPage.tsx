import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { loginUser, loginWithFirebase, registerUser } from "../../api";
import { auth } from "../../firebase";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const result = isLogin
                ? await loginUser(email, password)
                : await registerUser(name || email.split("@")[0], email, password);

            localStorage.setItem("chhaya_token", result.token);
            navigate("/app");
        } catch (err: any) {
            setError(err.message || "An error occurred");
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        if (!auth) {
            setError("Authentication is not configured in this environment.");
            return;
        }

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const email = result.user.email || "";
            const displayName = result.user.displayName || "";
            if (!email) {
                throw new Error("Google account email not available.");
            }

            const idToken = await result.user.getIdToken();
            try {
                const backend = await loginWithFirebase(email, displayName);
                localStorage.setItem("chhaya_token", backend.token);
            } catch {
                localStorage.setItem("chhaya_token", idToken);
            }
            navigate("/app");
        } catch (err: any) {
            setError(err.message || "Failed to sign in with Google");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-bg">
                <img src="/src/assets/auth_bg_new.png" alt="Chhaya Background" />
            </div>
            <div className="auth-box">
                <h1 className="auth-title">CHHAYA</h1>
                <p className="auth-subtitle">{isLogin ? "Welcome Back" : "Create an Account"}</p>
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="auth-input"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <button type="submit" className="auth-btn">
                        {isLogin ? "Sign In" : "Sign Up"}
                    </button>
                    <button type="button" onClick={handleGoogleSignIn} className="auth-btn google-btn" style={{ marginTop: "10px", backgroundColor: "#DB4437" }}>
                        Sign in with Google
                    </button>
                </form>

                <div className="auth-switch">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="auth-switch-btn">
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
