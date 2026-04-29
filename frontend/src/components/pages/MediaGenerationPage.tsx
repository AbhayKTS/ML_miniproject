import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ClipsPage from "./ClipsPage";
import { generateVideo, generateImage, generateAudio, Generation } from "../../api";

type MediaType = "video" | "image" | "audio";

const MediaGenerationPage = () => {
    const [mediaType, setMediaType] = useState<MediaType>("video");
    const location = useLocation();

    // States
    const [videoInput, setVideoInput] = useState("");
    const [imageInput, setImageInput] = useState("");
    const [audioInput, setAudioInput] = useState("");
    const [audioType, setAudioType] = useState<"speech" | "music">("speech");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedMedia, setGeneratedMedia] = useState<Generation | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.autoSelect) {
            setMediaType(location.state.autoSelect);
        }
    }, [location.state]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedMedia(null);
        setError(null);

        try {
            let result: Generation;
            if (mediaType === "video") {
                result = await generateVideo(videoInput);
            } else if (mediaType === "image") {
                result = await generateImage(imageInput);
            } else {
                result = await generateAudio(audioInput, audioType);
            }
            setGeneratedMedia(result);
        } catch (err: any) {
            setError(err.message || "Generation failed");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Dropdown sticky header for media generation picking */}
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
                <strong style={{ fontSize: "14px", color: "var(--text-muted)" }}>Media Generator:</strong>
                <select
                    value={mediaType}
                    onChange={(e) => {
                        setMediaType(e.target.value as MediaType);
                        setGeneratedMedia(null); // Reset mockup on tab switch
                    }}
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
                    <option value="video">🎬 Video Generation</option>
                    <option value="image">🖼 Image Generation</option>
                    <option value="audio">🎵 Audio Generation</option>
                </select>
            </div>

            {/* Media Panels */}
            <div className="page" style={{ paddingTop: 24 }}>
                {mediaType === "video" && (
                    <div className="split">
                        <div className="panel controls">
                            <h3 style={{ marginBottom: 12 }}>🎬 Video Pipeline</h3>
                            <div className="control-group">
                                <label>Video Generation Prompt (from Visuals workspace)</label>
                                <textarea rows={5} placeholder="Paste your video prompt from the Prompt Studio here..." value={videoInput} onChange={(e) => setVideoInput(e.target.value)} />
                            </div>
                            {error && <p style={{ color: 'var(--accent-red)', marginBottom: 12 }}>{error}</p>}
                            <button className="button-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? "⏳ Rendering Video..." : "✨ Generate Video Clips"}
                            </button>
                        </div>
                        <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <h3 style={{ marginBottom: 12 }}>Generated Video Outputs</h3>
                            {isGenerating ? (
                                <div className="output-block text-loading">
                                    <div className="loading-shimmer" style={{ height: 160, borderRadius: 12 }} />
                                    <p style={{ marginTop: 12, textAlign: 'center', color: 'var(--text-muted)' }}>Contacting Video Synthesis Engine... (Stand-in)</p>
                                </div>
                            ) : (generatedMedia || error) ? (
                                <div style={{ background: "rgba(0,0,0,0.15)", padding: 16, borderRadius: 12, border: "1px dashed rgba(255,255,255,0.1)" }}>
                                    {generatedMedia && (
                                        <>
                                            <p style={{ color: "var(--accent-primary)", marginBottom: 12 }}>
                                                {generatedMedia.modality.toUpperCase()} Generated successfully (ID: {generatedMedia.id})
                                            </p>
                                            <div style={{ marginBottom: 12, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 4, maxHeight: 100, overflow: 'auto', fontSize: '12px' }}>
                                                <code>{generatedMedia.output}</code>
                                            </div>
                                        </>
                                    )}
                                    <ClipsPage />
                                </div>
                            ) : (
                                <div style={{ background: "rgba(0,0,0,0.05)", padding: 32, borderRadius: 12, textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Provide prompts first to generate your video clip highlight reels.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {mediaType === "image" && (
                    <div className="split">
                        <div className="panel controls">
                            <h3 style={{ marginBottom: 12 }}>🖼 Fast Image Generation</h3>
                            <div className="control-group">
                                <label>Image Generation Prompt</label>
                                <textarea rows={5} placeholder="Paste your generated concept prompt here..." value={imageInput} onChange={e => setImageInput(e.target.value)} />
                            </div>
                            <div className="control-group">
                                <label>Aspect Ratio</label>
                                <select>
                                    <option>16:9 (Landscape)</option>
                                    <option>9:16 (Vertical)</option>
                                    <option>1:1 (Square)</option>
                                </select>
                            </div>
                            {error && <p style={{ color: 'var(--accent-red)', marginBottom: 12 }}>{error}</p>}
                            <button className="button-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? "⏳ Rendering Image..." : "🖼 Generate High-Fidelity Image"}
                            </button>
                        </div>
                        <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <h3 style={{ marginBottom: 12 }}>Output Images</h3>
                            {isGenerating ? (
                                <div className="output-block text-loading">
                                    <div className="loading-shimmer" style={{ height: 300, borderRadius: 12 }} />
                                    <p style={{ marginTop: 12, textAlign: 'center', color: 'var(--text-muted)' }}>Contacting Image Synthesis Engine...</p>
                                </div>
                            ) : generatedMedia ? (
                                <div style={{ background: "rgba(0,0,0,0.15)", padding: 16, borderRadius: 12, border: "1px dashed rgba(255,255,255,0.1)", textAlign: "center" }}>
                                    <p style={{ color: "var(--accent-primary)", marginBottom: 12 }}>
                                        {generatedMedia.modality.toUpperCase()} Generated successfully
                                    </p>
                                    <div style={{ marginBottom: 12, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 4, maxHeight: 100, overflow: 'auto', fontSize: '12px' }}>
                                        <code>{generatedMedia.prompt.slice(0, 100)}...</code>
                                    </div>
                                    <img src={generatedMedia.output} style={{ width: '100%', borderRadius: 8, marginTop: 16 }} alt="Generated Asset" />
                                </div>
                            ) : (
                                <div className="output-block" style={{ color: "var(--text-muted)", textAlign: "center", padding: "60px 20px" }}>
                                    Images will appear here. No generations yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {mediaType === "audio" && (
                    <div className="split">
                        <div className="panel controls">
                            <h3 style={{ marginBottom: 12 }}>🎵 Studio Audio Engine</h3>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                <button
                                    className={audioType === "speech" ? "button-primary" : "ghost-button"}
                                    style={{ flex: 1, padding: '8px' }}
                                    onClick={() => setAudioType("speech")}
                                >
                                    🎙️ Narrator
                                </button>
                                <button
                                    className={audioType === "music" ? "button-primary" : "ghost-button"}
                                    style={{ flex: 1, padding: '8px' }}
                                    onClick={() => setAudioType("music")}
                                >
                                    🎹 Scoring
                                </button>
                            </div>

                            <div className="control-group">
                                <label>{audioType === "speech" ? "Narrator Script" : "Musical Score Prompt"}</label>
                                <textarea
                                    rows={5}
                                    placeholder={audioType === "speech" ? "Paste your video script here..." : "Describe the mood, instruments, and style..."}
                                    value={audioInput}
                                    onChange={(e) => setAudioInput(e.target.value)}
                                />
                            </div>
                            {error && <p style={{ color: 'var(--accent-red)', marginBottom: 12 }}>{error}</p>}
                            <button className="button-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? "⏳ Synthesizing..." : `🎵 Generate ${audioType === "speech" ? "Voiceover" : "Music"}`}
                            </button>
                        </div>
                        <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <h3 style={{ marginBottom: 12 }}>Audio Tracks</h3>
                            {isGenerating ? (
                                <div className="output-block text-loading">
                                    <div className="loading-shimmer" style={{ height: 100, borderRadius: 12 }} />
                                    <p style={{ marginTop: 12, textAlign: 'center', color: 'var(--text-muted)' }}>Contacting Audio Synthesis Engine...</p>
                                </div>
                            ) : generatedMedia ? (
                                <div style={{ background: "rgba(0,0,0,0.15)", padding: 16, borderRadius: 12, border: "1px dashed rgba(255,255,255,0.1)", textAlign: "center" }}>
                                    <p style={{ color: "var(--accent-primary)", marginBottom: 12 }}>
                                        {generatedMedia.modality.toUpperCase()} ({audioType.toUpperCase()}) Generated successfully
                                    </p>
                                    <div style={{ marginBottom: 12, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 4, maxHeight: 100, overflow: 'auto', fontSize: '12px' }}>
                                        <code>{generatedMedia.prompt.slice(0, 100)}...</code>
                                    </div>
                                    <div style={{ padding: '20px', background: 'var(--bg-elevated)', borderRadius: 8, marginTop: 16 }}>
                                        <audio
                                            controls
                                            src={generatedMedia.output}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="output-block" style={{ color: "var(--text-muted)", textAlign: "center", padding: "60px 20px" }}>
                                    Audio tracks will appear here. No generations yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaGenerationPage;
