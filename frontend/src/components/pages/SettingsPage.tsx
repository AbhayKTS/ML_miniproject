import MemoryPage from "./MemoryPage";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <MemoryPage />
            <div style={{ padding: '0 32px' }}>
                <hr style={{ borderTop: "1px solid var(--border)", margin: "0" }} />
            </div>
            <div style={{ padding: '0 32px' }}>
                <h2 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>Analytics</h2>
                <AnalyticsDashboard />
            </div>
            <div style={{ padding: '0 32px 32px 32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleLogout}
                    className="button-primary"
                    style={{ background: "#DB4437", borderColor: "#DB4437" }}
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
