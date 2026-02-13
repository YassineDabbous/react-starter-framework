export interface FrameworkEventMap {
    // Core framework events
    "auth:unauthorized": void;
    "auth:login": { user: any }; // TODO: Replace with User type when available in this scope
    "auth:logout": void;
    "theme:changed": { theme: string };
    "i18n:language-changed": { locale: string };

    // App events
    "notify": { message: string; type?: "success" | "error" | "info" | "warning" };
}
