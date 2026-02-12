import { createContext, useContext, ReactNode, useMemo } from "react";
import { BaseUserInfo } from "../types/entity";
import { BaseSettings } from "../types/settings";

export interface FrameworkContextValue {
    user: BaseUserInfo | null;
    settings: BaseSettings | null;
    token?: string | null;
    actions?: {
        setSettings: (settings: any) => void;
        clearAuth: () => void;
    };
}

const FrameworkContext = createContext<FrameworkContextValue | null>(null);

export function useFrameworkContext() {
    const context = useContext(FrameworkContext);
    return context;
}

interface FrameworkProviderProps extends FrameworkContextValue {
    children: ReactNode;
}

export function FrameworkProvider({ children, user, settings, token, actions }: FrameworkProviderProps) {
    const value = useMemo(
        () => ({
            user,
            settings,
            token,
            actions,
        }),
        [user, settings, token, actions],
    );

    return <FrameworkContext.Provider value={value}>{children}</FrameworkContext.Provider>;
}
