# Getting Started

Welcome to **@yassinedabbous/react-framework**. This guide will walk you through integrating the framework into your React projects.

## Prerequisite
The framework is designed to work with **Vite**, **React 19**, and **Tailwind CSS**.

## Installation

The most common way to use this framework is as a **Git Submodule**. This allows you to receive updates while maintaining the ability to tweak core logic if needed.

### 1. Add as a Submodule
In your React project root, run:

```bash
git submodule add https://github.com/YassineDabbous/react-starter-framework.git packages/framework
```

### 2. Configure Path Aliases
Update your `tsconfig.json` (or `tsconfig.app.json`) to allow easy imports from the framework:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/framework/*": ["packages/framework/src/*"]
    }
  },
  "include": ["src", "packages", "types"]
}
```

### 3. Tailwind Configuration
Ensure Tailwind scans the framework components for CSS classes in `tailwind.config.ts`:

```typescript
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./packages/framework/src/**/*.{js,ts,jsx,tsx}" // Add this
  ],
  // ...
}
```

---

## Initialization

Before using framework features like the Router or Storage, you must initialize the framework settings in your `main.tsx`:

```tsx
import { initFramework } from "@/framework/config";
import { APP_REGISTRY } from "@/apps/registry"; // Your app list

initFramework({
  storageName: "my-app-storage",
  baseApi: "https://api.example.com",
  appRegistry: APP_REGISTRY,
  defaultLocale: "en_US",
  defaultAppId: "dashboard", // Fallback app if no match found
  superAdminRole: "admin"    // Customize the god-mode role ID
});
```

### Context Detection
The framework automatically detects which app is "active" based on the URL. You can get the current context anywhere using:

```tsx
import { getAppContext } from "@/framework";
const context = getAppContext();
```

---

## Next Steps
- Learn about the [Architecture](./architecture.md)
- Explore the [Hooks and Utilities](./hooks-and-utils.md)
- Configure [Theming & RTL](./theming-and-rtl.md)
