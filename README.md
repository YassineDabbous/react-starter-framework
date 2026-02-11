# Framework Layer

This directory contains the core framework logic, designed to be application-agnostic and reusable.

## Architecture

The framework follows a **Configuration-Driven Architecture**. The application injections its specific components, layouts, and data into the framework during initialization.

### Core Components

- **Router**: The main entry point for routing. It accepts a `FrameworkConfig` object.
- **Store**: Pure state containers (Zustand) for user data and settings.
- **Locales**: Injectable i18n support.
- **Theme**: A centralized theme system based on design tokens.

## Usage

### 1. Initialization

In your application's entry point (`main.tsx`), initialize the framework settings and i18n resources:

```typescript
import { initFramework } from "@/framework/config";
import { initI18n } from "@/framework/locales/i18n";
import resources from "@/app/lang";

initFramework({
  storageName: import.meta.env.VITE_APP_STORAGE_NAME,
  baseApi: import.meta.env.VITE_APP_BASE_API,
  homepage: import.meta.env.VITE_APP_HOMEPAGE,
  defaultLocale: import.meta.env.VITE_APP_LOCALE,
});

initI18n(resources);
```

### 2. Configuration

Pass a `FrameworkConfig` to the `Router` component:

```typescript
const frameworkConfig = {
  layouts: { dashboard: <MyLayout /> },
  pages: import.meta.glob("./pages/**/*.tsx"),
  defaultPermissions: [],
  components: { circleLoading: <MyLoader /> }
};

<Router config={frameworkConfig} />
```

## API Client

The `BaseApiClient` provides a standardized way to make HTTP requests with built-in error handling and token management.
