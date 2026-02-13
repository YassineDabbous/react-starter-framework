# Hooks & Utilities Reference

The framework provides a set of reactive hooks and utilities to solve common infrastructure problems in a UI-agnostic way.

---

## 1. `usePermission` (Smart Guard)
Manage granular access control with fallback support and role-based checks.

```tsx
import { usePermission, Can } from "@/framework";

function MyComponent() {
  // Zero-Config: Automatically uses user/permissions from FrameworkProvider
  const { can, is } = usePermission();

  // 1. Programmatic check
  if (can('user.edit')) { /* ... */ }
  if (is('admin')) { /* ... */ }

  // 2. Declarative check (Wrapper)
  // Also uses context automatically!
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
```tsx
// Zero-Config: Inherits 'settings.direction' from FrameworkProvider
const { direction, isRtl, isLtr } = useDirection();

return <div className={isRtl ? 'pr-4' : 'pl-4'}>Content</div>;
```

### Features:
- **Automatic Sync**: Syncs with the `<html>` `dir` attribute automatically.
- **Theme Support**: Integrated with standard RTL detection.

---

## 4. Performance Monitoring
Tools to debug and optimize application performance.

### `usePerformance` (Web Vitals)
Automatically reports Core Web Vitals (LCP, CLS, INP, etc.) to the console or a custom analytics handler.

```tsx
// in src/main.tsx or specific component
usePerformance((metric) => {
  console.log(metric); // { name: 'LCP', value: 2500, ... }
  // sendToAnalytics(metric);
});
```

### `useRenderCount` (Render Tracker)
Logs how many times a component re-renders. Great for finding optimization candidates.

```tsx
function ExpensiveGrid() {
  useRenderCount("ExpensiveGrid"); 
  // Logs: [RenderCount] ExpensiveGrid: 1, 2, 3...
  return <div />;
}
```

---

## 5. `EventBus` (Cross-App Sync)
A lightweight, type-safe emitter for decoupled communication.

```tsx
 import { eventBus } from "@/framework/utils/eventBus";

 // 1. Subscribe (Type-safe!)
 const unsubscribe = eventBus.on("theme:changed", ({ theme }) => {
   console.log("Theme changed to:", theme);
 });

 // 2. Emit (Type-checked payloads!)
 eventBus.emit("theme:changed", { theme: "dark" });
 
 // Errors if payload doesn't match the event type:
 // eventBus.emit("theme:changed", { theme: 123 }); // Error!
 ```

---

## Next Steps
- Learn about [Theming & RTL](./theming-and-rtl.md)
- Configure the [API Client](./api-client.md)
