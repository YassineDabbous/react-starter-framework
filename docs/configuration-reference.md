# Configuration Reference

This document provides a comprehensive list of all configuration options available in the framework.

---

## 1. Global Settings (`initFramework`)

Called in your shell's entry point (`main.tsx`).

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `appRegistry` | `AppRegistry` | **Required** | List of all applications to be managed by the framework. |
| `storageName` | `string` | `"app"` | Prefix for LocalStorage keys to avoid collisions with other apps on the same domain. |
| `baseApi` | `string` | **Required** | The root URL for the `BaseApiClient`. |
| `homepage` | `string` | `"/"` | The path users are redirected to after login. |
| `defaultLocale` | `string` | **Required** | Fallback locale if detection fails. |
| `defaultAppId` | `string` | `undefined` | The ID of the app to load if no host or path match is found. |
| `superAdminRole` | `string` | `"superadmin"` | The role ID that bypasses all permission checks. |
| `theme` | `AppThemeConfig` | `undefined` | Global theme tokens (can be overridden by specific apps). |

---

## 2. App Definition (`AppConfig`)

The structure of each entry in the `appRegistry`.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (used for storage namespacing). |
| `name` | `string` | Human-readable name. |
| `hostPrefix` | `string` | (Optional) Subdomain prefix for app detection (e.g., `"admin."`). |
| `pathPrefix` | `string` | (Optional) Path prefix for app detection (e.g., `"/student"`). |
| `loadApp` | `() => Promise` | Dynamic import for the main App component. |
| `loadLang` | `() => Promise` | Dynamic import for the app's default language file. |
| `theme` | `AppThemeConfig` | Overrides for global theme tokens (fonts, colors). |

---

## 3. Router Configuration (`FrameworkConfig`)

Passed to the `<Router />` component within each individual app.

```tsx
interface FrameworkConfig {
    layouts: {
        dashboard: React.ReactNode;
        auth?: React.ReactNode;
    };
    pages: Record<string, () => Promise<any>>; // Typically from import.meta.glob
    defaultPermissions?: string[];
    components?: {
        circleLoading?: React.ReactNode;
        errorBoundary?: React.ReactNode;
    };
    auth?: {
        loginPath?: string;
    }
}
```

### Pages Loader
The `pages` property is designed to work with Vite's `import.meta.glob`. It automatically maps file paths to routes:
- `./pages/dashboard/index.tsx` → `/dashboard`
- `./pages/users/[id].tsx` → `/users/:id`

---

## Next Steps
- Learn about [Router & Navigation](./router-and-navigation.md)
- Reference [Hooks & Utilities](./hooks-and-utils.md)
