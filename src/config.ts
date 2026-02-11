import type { AppThemeConfig, AppRegistry } from "./types/app";

export interface FrameworkSettings {
    storageName: string;
    baseApi: string;
    homepage: string;
    defaultLocale: string;
    appRegistry: AppRegistry;
    defaultAppId?: string;
    superAdminRole?: string;
    theme?: AppThemeConfig;
}

let settings: FrameworkSettings = {
    storageName: "app",
    baseApi: "",
    homepage: "/",
    defaultLocale: "en_US",
    appRegistry: [],
    superAdminRole: "superadmin",
};

export function initFramework(newSettings: Partial<FrameworkSettings>) {
    settings = { ...settings, ...newSettings };
}

export function getFrameworkSettings() {
    return settings;
}
