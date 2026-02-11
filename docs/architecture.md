# Architecture & Core Patterns

The framework follows a **Configuration-Driven Architecture**, allowing a single core to power multiple applications (Multi-Tenancy) with distinct behaviors, roles, and themes.

## 1. Registry Pattern
The framework is completely decoupled from the specific apps it serves. Instead of hardcoding "Student" or "Admin" logic into the core, apps are defined in a **Registry**.

### The App Registry
An app is registered with its detection logic and asset loaders:

```typescript
const APP_REGISTRY = [
  {
    id: "dashboard",
    hostPrefix: "dash.",
    pathPrefix: "/dashboard",
    loadApp: () => import("@/apps/dashboard/App"),
    loadLang: () => import("@/apps/dashboard/lang/en"),
    theme: { /* app specific theme overrides */ }
  }
];
```

## 2. Dynamic Context Detection
During bootstrapping (`main.tsx`), the framework uses `getAppContext()` to resolve which app should be loaded based on the current `window.location`.

1.  **Host-based**: `dash.example.com` → Dashboard App.
2.  **Path-based**: `example.com/admin` → Admin App.
3.  **Default**: Falls back to the `defaultAppId` defined in settings.

## 3. Injectable Initialization
Upon start-up, the shell application "injects" its specific configuration into the framework:

```typescript
initFramework({
  appRegistry: APP_REGISTRY, // Injected dependency
  defaultAppId: "dashboard",
  storageName: "platform_v3",
  baseApi: "/v1/api"
});
```

This pattern ensures that `packages/framework` has **Zero Dependencies** on `src/apps`, which is why it can be used as a standalone Git Submodule.

## 4. Logical Boundaries
-   **Framework**: Generic tools (auth, storage, multi-tenancy logic, permissions).
-   **Apps**: UI components, specific business logic, and API endpoints.
-   **Shared**: Constants and layouts that items might share across apps but are not "framework" tools (e.g., a common footer).

---

## Next Steps
- Reference the [Hooks and Utilities](./hooks-and-utils.md)
- Learn about [Theming & RTL](./theming-and-rtl.md)
