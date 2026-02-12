import { createContext, useContext, ReactNode, useMemo, useEffect, useRef } from "react";
import { BaseUserInfo } from "../types/entity";
import { BaseSettings } from "../types/settings";
import BaseApiClient, { createApiClient } from "../api/BaseApiClient";
import type { ApiClientConfig } from "../api/BaseApiClient";

export interface FrameworkContextValue {
    user: BaseUserInfo | null;
    settings: BaseSettings | null;
    token?: string | null;
    apiClient?: ReturnType<typeof createApiClient>;
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

interface FrameworkProviderProps extends Omit<FrameworkContextValue, 'apiClient'> {
    children: ReactNode;
    apiClientConfig?: ApiClientConfig;
}

export function FrameworkProvider({ children, user, settings, token, actions, apiClientConfig }: FrameworkProviderProps) {
    const tokenRef = useRef(token);
    const clearAuthRef = useRef(actions?.clearAuth);

    // Create API client instance with configuration
    const apiClient = useMemo(
        () => createApiClient({
            ...apiClientConfig,
            tokenProvider: () => tokenRef.current,
            onAuthError: () => clearAuthRef.current?.(),
        }),
        [apiClientConfig]
    );

    // Update refs when props change
    useEffect(() => {
        tokenRef.current = token;
    }, [token]);

    useEffect(() => {
        clearAuthRef.current = actions?.clearAuth;
    }, [actions?.clearAuth]);

    // Sync with static singleton for backward compatibility
    useEffect(() => {
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
            apiClient,
            actions,
        }),
        [user, settings, token, apiClient, actions],
    );

    return <FrameworkContext.Provider value={value}>{children}</FrameworkContext.Provider>;
}

