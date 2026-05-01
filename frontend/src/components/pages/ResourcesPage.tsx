import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

interface PublishedItem {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  publishedAt: string;
}

const MOCK_DATA = [
  {
    title: "Cinematic Intro Template",
    description: "A ready-to-use cinematic intro template with dark themes and slow build-up.",
    type: "Template",
    url: "#",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Urban Cyberpunk Soundscape",
    description: "Background audio loops ideal for futuristic urban environments.",
    type: "Audio",
    url: "#",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    title: "Neon City Visuals",
    description: "High-contrast neon visual pack for modern dynamic storytelling.",
    type: "Visual",
    url: "#",
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

const ResourcesPage = () => {
  const [resources, setResources] = useState<PublishedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const q = query(collection(db, "published_content"), orderBy("publishedAt", "desc"));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          console.log("No resources found in Firestore, seeding mock data...");
          const newItems = [];
          for (const item of MOCK_DATA) {
            const docRef = await addDoc(collection(db, "published_content"), item);
            newItems.push({ id: docRef.id, ...item });
          }
          setResources(newItems);
        } else {
          const items: PublishedItem[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as PublishedItem);
          });
          setResources(items);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="workspace-container">
      <div className="workspace-header">
        <h1>Published Resources</h1>
        <p className="subtitle">Explore content published by the community</p>
      </div>

      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading resources...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {resources.map((item) => (
              <div key={item.id} className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ margin: 0, fontSize: "18px" }}>{item.title}</h3>
                  <span className="badge" style={{ backgroundColor: "var(--accent)", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
                    {item.type}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)", flex: 1 }}>{item.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                  <button className="button-primary" style={{ padding: "6px 12px", fontSize: "13px" }}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
