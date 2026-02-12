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

## 4. Framework Context Pattern
To bridge the gap between your Application State (Zustand, Redux, Context) and the Framework's internal tools, we use the **Framework Context Pattern**.

### The Problem
The Framework needs to know about the current user, settings, and token to perform tasks like:
- Checking permissions in `usePermission`.
- Injecting tokens in `BaseApiClient`.
- Handling RTL in `useDirection`.

But the Framework cannot import your stores because that would create a circular dependency.

### The Solution: `FrameworkProvider`
Your App pushes its state *down* into the Framework via the `FrameworkProvider`.

```mermaid
graph TD
    A[App Store (Zustand)] -->|Passes State| B(FrameworkProvider)
    B -->|Provides Context| C{Framework Tools}
    C --> D[usePermission]
    C --> E[BaseApiClient]
    C --> F[Router Guards]
```

This achieves **Minimalist DX**: simpler hooks that "just work" without arguments.

## 5. Logical Boundaries
-   **Framework**: Generic tools (auth, storage, multi-tenancy logic, permissions).
-   **Apps**: UI components, specific business logic, and API endpoints.
-   **Shared**: Constants and layouts that items might share across apps but are not "framework" tools (e.g., a common footer).

## 5. App Loading Lifecycle
When a user visits the URL, the following sequence occurs:

1.  **Boot**: `main.tsx` executes and calls `initFramework` with the `appRegistry`.
2.  **Detect**: `getAppContext()` parses `window.location` and finds the matching app profile.
3.  **Load**: `Promise.all` executes the app's `loadApp()` and `loadLang()` dynamic imports.
4.  **Inject**: The app's specific `theme` is merged into the framework settings via a second `initFramework` call.
5.  **Render**: The framework's `<Router />` is mounted, setting up the file-system routes and the global layout.

---

## Next Steps
- Reference the [Hooks and Utilities](./hooks-and-utils.md)
- Learn about [Theming & RTL](./theming-and-rtl.md)
