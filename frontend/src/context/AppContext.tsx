import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CreativeMemory, Generation, getMemory, checkHealth } from "../api";
// Context for global app state, including user info, backend status, creative memory, and last generation.
interface AppState {
    userId: string;
    backendOnline: boolean;
    memory: CreativeMemory | null;
    lastGeneration: Generation | null;
    setMemory: (m: CreativeMemory) => void;
    setLastGeneration: (g: Generation) => void;
    refreshMemory: () => Promise<void>;
}

const defaultMemory: CreativeMemory = {
    userId: "guest",
    tone: "warm visionary",
    themes: ["mythic futurism"],
    visualStyle: "painterly neon",
    audioStyle: "airy synth",
    culturalContext: "coastal ritual",
    lock: false,
    updatedAt: new Date().toISOString(),
    lastUsedAt: new Date().toISOString(),
};

const AppContext = createContext<AppState>({
    userId: "guest",
    backendOnline: false,
    memory: defaultMemory,
    lastGeneration: null,
    setMemory: () => { },
    setLastGeneration: () => { },
    refreshMemory: async () => { },
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [userId] = useState("guest");
    const [backendOnline, setBackendOnline] = useState(false);
    const [memory, setMemory] = useState<CreativeMemory | null>(null);
    const [lastGeneration, setLastGeneration] = useState<Generation | null>(null);

    const refreshMemory = async () => {
        try {
            const m = await getMemory();
            setMemory(m);
        } catch {
            setMemory(defaultMemory);
        }
    };

    useEffect(() => {
        checkHealth()
            .then(() => {
                setBackendOnline(true);
                refreshMemory();
            })
            .catch(() => {
                setBackendOnline(false);
                setMemory(defaultMemory);
            });
    }, []);

    return (
        <AppContext.Provider
            value={{ userId, backendOnline, memory, lastGeneration, setMemory, setLastGeneration, refreshMemory }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
