import { ThemeMode, ThemeColorPresets } from "./enum";

/**
 * The "Infrastructure" settings.
 * Framework engine (ThemeProvider, etc.) depends on these to render.
 */
export interface BaseSettings {
    // Theme Engine Core
    themeMode: ThemeMode;
    themeColorPresets: ThemeColorPresets;

    // Typography Engine Core
    fontFamily: string;
    fontSize: number;

    // Layout Direction Core (Automatic RTL support)
    direction: "ltr" | "rtl";
}
