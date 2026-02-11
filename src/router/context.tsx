import { createContext, useContext } from "react";
import type { FrameworkConfig } from "@/framework/types/router";

export const FrameworkConfigContext = createContext<FrameworkConfig | null>(null);

export function useFrameworkConfig() {
    const context = useContext(FrameworkConfigContext);
    if (!context) {
        throw new Error("useFrameworkConfig must be used within a FrameworkConfigProvider");
    }
    return context;
}
