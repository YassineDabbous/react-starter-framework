import { getFrameworkSettings } from "../config";

/**
 * Checks for common configuration issues and logs warnings in development mode.
 * This is intended to be called during application initialization.
 */
export function checkDevWarnings() {
    // Only run in development mode
    if (!import.meta.env.DEV) return;

    const settings = getFrameworkSettings();

    // Warn about default storage name
    if (settings.storageName === "app") {
        console.warn(
            "%c[Framework] ⚠️ You are using the default 'storageName' ('app').\n" +
            "It is recommended to set a unique 'storageName' in your app configuration to prevent storage collisions between apps.",
            "font-weight: bold;",
        );
    }

    // Inform about mocking
    if (import.meta.env.VITE_MOCK_ENABLED === "true") {
        console.info(
            "%c[Framework] ℹ️ Mocking is ENABLED. API requests will be intercepted.",
            "color: #3b82f6; font-weight: bold;",
        );
    }

    // Warn about missing baseApi overrides (though validateFrameworkConfig handles empty, this checks if it's potentially default)
    // (Optional: if we want to warn about "localhost" in production build even if strictly we are in DEV here)
}
