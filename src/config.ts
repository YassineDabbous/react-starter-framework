import type { AppThemeConfig, AppRegistry } from "./types/app";

export interface FrameworkSettings {
    storageName: string;
    baseApi: string;
    homepage: string;
    defaultLocale: string;
    appRegistry: AppRegistry;
    theme?: AppThemeConfig;
}

let settings: FrameworkSettings = {
    storageName: "app",
    baseApi: "",
    homepage: "/",
    defaultLocale: "en_US",
    appRegistry: [],
};

export function initFramework(newSettings: Partial<FrameworkSettings>) {
    settings = { ...settings, ...newSettings };
}

export function getFrameworkSettings() {
    return settings;
}
