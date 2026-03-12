import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AnalyticsDashboard = () => {
    const [data, setData] = useState([
        { name: "Text", generated: 120 },
        { name: "Image", generated: 85 },
        { name: "Audio", generated: 45 },
    ]);

    useEffect(() => {
        // Mock data fetch
    }, []);

    return (
        <div style={{ padding: "20px", color: "white" }}>
            <h2>User Analytics Dashboard</h2>
            <p>Track your content generation history across different media types.</p>
            <div style={{ width: "100%", height: 300, marginTop: "20px", background: "#111", padding: "20px", borderRadius: "10px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip />
                        <Bar dataKey="generated" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
                <div style={{ flex: 1, padding: "20px", background: "#222", borderRadius: "8px" }}>
                    <h3>Total Generations</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold" }}>250</p>
                </div>
                <div style={{ flex: 1, padding: "20px", background: "#222", borderRadius: "8px" }}>
                    <h3>Most Active</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold" }}>Text</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
