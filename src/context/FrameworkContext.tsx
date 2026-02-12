import { createContext, useContext, ReactNode, useMemo, useEffect, useRef } from "react";
import { BaseUserInfo } from "../types/entity";
import { BaseSettings } from "../types/settings";
import BaseApiClient from "../api/BaseApiClient";

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
    const tokenRef = useRef(token);
    const clearAuthRef = useRef(actions?.clearAuth);

    useEffect(() => {
        tokenRef.current = token;
    }, [token]);

    useEffect(() => {
        clearAuthRef.current = actions?.clearAuth;
    }, [actions?.clearAuth]);

    useEffect(() => {
        // Automatically sync with the static API client for a Minimalist DX
        BaseApiClient.setTokenProvider(() => tokenRef.current);
        if (actions?.clearAuth) {
            BaseApiClient.setOnAuthError(() => clearAuthRef.current?.());
        }
    }, []); // Run once on mount

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
