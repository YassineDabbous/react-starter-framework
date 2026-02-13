# Router & Navigation

The framework provides a sophisticated, file-system-based routing engine built on top of `react-router` (v7).

## 1. Automated Route Generation
The framework uses `import.meta.glob` to automatically discover and register routes. This eliminates the need for manual route definitions in large apps.

### File Naming Convention
- **Index Routes**: `pages/home/index.tsx` becomes `/home`.
- **Dynamic Routes**: `pages/user/[id].tsx` becomes `/user/:id`.
- **Nested Routes**: Folders define the path depth.

```tsx
// Example in any Application's App.tsx
import { Router } from "@/framework";

const config = {
  pages: import.meta.glob("./pages/**/*.tsx"), // Automated discovery
  // ...
};

return <Router config={config} />;
```

## 2. Protected Routes
The Router automatically wraps dashboard pages in a `ProtectedRoute` component.

- **Check**: It verifies the presence of an `accessToken` in the **FrameworkContext**.
- **Redirect**: If unauthenticated, it redirects to the `auth.loginPath` (defaults to `/login`).

## 3. Permission-Gated Routes
Routes can be restricted based on permissions defined in the page component itself.

### Component-Level Guard
You can export a `permissions` array from any page component:

```tsx
// pages/admin/Settings.tsx
export const permissions = ["admin.settings.read"];

export default function SettingsPage() {
  return <div>Sensitive Settings</div>;
}
```

The framework's `usePermissionRoutes` hook will automatically filter this route out if the current user lacks the required permission.

## 4. Layout Orchestration
The framework supports two main layout slots:
- **`dashboard`**: Typically includes your Sidebar, Header, and a `<Content />` area.
- **`auth`**: A simpler layout for Login/Register pages.

The Router ensures that only authorized users see the `dashboard` layout.

## 5. Error Handling
The framework automatically wraps routes with a **RouteErrorBoundary**.

- **Chunk Load Errors**: Automatically attempts to reload the page if a lazy-loaded chunk fails (e.g., after a new deployment).
- **Runtime Errors**: Catches component crashes and displays a user-friendly error UI.
- **Customization**: You can provide a custom `errorBoundary` component in the router config.

```tsx
<Router config={{
  ...config,
  components: {
    errorBoundary: <MyCustomErrorPage />
  }
}} />
```

---

## Next Steps
- Reference [Hooks & Utilities](./hooks-and-utils.md)
- Learn about [Mocking & Testing](./mocking-and-testing.md)
