# Theming & RTL Support

The framework uses **Vanilla Extract** for high-performance styling and **CSS Logical Properties** for inherent RTL compatibility.

## 1. Design Tokens
Tokens are located in `theme/tokens`. They are converted into CSS variables during build time.

### Usage
The `ThemeProvider` relies on `FrameworkProvider` for the active settings (theme mode, color preset, etc.).

```tsx
<FrameworkProvider settings={appSettings} ...>
  <ThemeProvider adapters={[UIAdapter]}>
    <App />
  </ThemeProvider>
</FrameworkProvider>
```

### Typography
Managed in `theme/tokens/typography.ts`. You can override fonts per application:

```typescript
// App Configuration
const myApp = {
  theme: {
    fonts: {
      primary: "'Inter Variable', sans-serif",
      secondary: "'Readex Pro Variable', sans-serif" // Great for Arabic
    }
  }
}
```

## 2. RTL Philosophy
We avoid using `left` and `right`. Instead, always use **Logical Properties**:

```css
/* Bad (requires manual RTL swap) */
.card { padding-left: 20px; }

/* Good (works in both LTR and RTL) */
.card { padding-inline-start: 20px; }
```

### Automatic Orchestration
The `useLocale` hook automatically manages the DOM metadata:
1.  Detects RTL languages (ar, he, fa, etc.).
2.  Sets `<html dir="rtl">`.
3.  Injects the correct font-family.

## 3. Tailwind Integration
To use RTL-specific styles in Tailwind, use the `rtl:` modifier:

```tsx
<div className="ml-4 rtl:mr-4">
  This is biased.
</div>

<div className="ms-4">
  This is logical (Better).
</div>
```

---

## Next Steps
- Reference the [API Client](./api-client.md)
- Back to [Getting Started](./getting-started.md)
