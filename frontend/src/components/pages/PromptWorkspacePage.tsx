import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TextWorkspacePage from "./TextWorkspacePage";
import ImageWorkspacePage from "./ImageWorkspacePage";
import AudioWorkspacePage from "./AudioWorkspacePage";

type GenerationType = "scripting" | "visuals" | "scoring";

const PromptWorkspacePage = () => {
    const [activeType, setActiveType] = useState<GenerationType>("scripting");
    const location = useLocation();

    useEffect(() => {
        if (location.state?.autoSelect) {
            setActiveType(location.state.autoSelect);
        }
    }, [location.state]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Dropdown sticky header for prompt generation picking */}
            <div style={{
                padding: "16px 32px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-elevated)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                position: "sticky",
                top: 0,
                zIndex: 10
            }}>
                <strong style={{ fontSize: "14px", color: "var(--text-muted)" }}>Current Prompt Generator:</strong>
                <select
                    value={activeType}
                    onChange={(e) => setActiveType(e.target.value as GenerationType)}
                    style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        background: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border)",
                        outline: "none",
                        fontWeight: "bold"
                    }}
                >
                    <option value="scripting">📜 Scripting (Text/Story)</option>
                    <option value="visuals">🌉 Visuals (Image)</option>
                    <option value="scoring">🎼 Scoring (Audio/Music)</option>
                </select>
            </div>

            {/* Render the underlying workspace component.
          To keep its styling intact without nesting 'page' classes weirdly, 
          we render the component as is. It already has its own padding/layout. */}
            {activeType === "scripting" && <TextWorkspacePage />}
            {activeType === "visuals" && <ImageWorkspacePage />}
            {activeType === "scoring" && <AudioWorkspacePage />}
        </div>
    );
};

export default PromptWorkspacePage;
