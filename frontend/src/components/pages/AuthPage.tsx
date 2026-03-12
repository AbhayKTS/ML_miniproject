import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            navigate("/app");
        } catch (err: any) {
            setError(err.message || "An error occurred");
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
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
                    <button type="button" onClick={handleGoogleSignIn} className="auth-btn google-btn" style={{ marginTop: '10px', backgroundColor: '#DB4437' }}>
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
