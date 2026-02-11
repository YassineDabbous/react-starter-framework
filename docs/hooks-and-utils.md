# Hooks & Utilities Reference

The framework provides a set of reactive hooks and utilities to solve common infrastructure problems in a UI-agnostic way.

---

## 1. `usePermission` (Smart Guard)
Manage granular access control with fallback support and role-based checks.

```tsx
import { usePermission, Can } from "@/framework";

function MyComponent() {
  const { can, is } = usePermission();

  // 1. Programmatic check
  if (can('user.edit')) { /* ... */ }
  if (is('admin')) { /* ... */ }

  // 2. Declarative check (Wrapper)
  return (
    <Can perform="dashboard.read" fallback={<p>No Access</p>}>
      <SecretData />
    </Can>
  );
}
```

### Features:
- **Wildcard support**: `can('user.*')` matches `user.edit`, `user.delete`, etc.
- **Super-Admin bypass**: Users with `superadmin` role or `*` permission node skip all checks.
- **Status Validation**: Automatically ignores permissions with `status: DISABLED`.

---

## 2. `useStorage` (Persistence Hub)
A reactive hook for namespaced Local Storage.

```tsx
const [token, setToken, remove] = useStorage<string>("userToken");

// Automatically namespaced: e.g., "dashboard_userToken"
setToken("my-secure-token", 3600); // Optional 1 hour TTL
```

### Features:
- **Namespacing**: Automatically prefixes keys with the active app ID to prevent collisions.
- **TTL (Time-to-Live)**: Support for temporary cache with automatic purging.
- **Type-Safety**: Pass genetic types for full intellisense.

---

## 3. `useDirection` (RTL Orchestrator)
Detect and react to the current layout direction.

```tsx
const { direction, isRtl, isLtr } = useDirection();

return <div className={isRtl ? 'pr-4' : 'pl-4'}>Content</div>;
```

### Features:
- **Automatic Sync**: Syncs with the `<html>` `dir` attribute automatically.
- **Theme Support**: Integrated with standard RTL detection.

---

## 4. `EventBus` (Cross-App Sync)
A lightweight, type-safe emitter for decoupled communication.

```tsx
import { eventBus } from "@/framework/utils/eventBus";

// Subscribe
const unsubscribe = eventBus.on("theme:change", (newTheme) => {
  console.log("Theme changed to:", newTheme);
});

// Emit
eventBus.emit("refresh:data", { force: true });
```

---

## Next Steps
- Learn about [Theming & RTL](./theming-and-rtl.md)
- Configure the [API Client](./api-client.md)
