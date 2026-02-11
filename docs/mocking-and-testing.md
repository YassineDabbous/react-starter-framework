# Mocking & Development

The framework includes a built-in integration with **MSW (Mock Service Worker)** to allow for rapid frontend development without a backend.

## 1. Enabling Mocks
Mocks are toggled via environment variables. In your project's `.env` file:

```bash
VITE_MOCK_ENABLED=true
```

## 2. Initialization
Mocks are initialized dynamically in `main.tsx` to keep the production bundle small.

```typescript
// main.tsx snippet
async function enableMocking() {
  if (import.meta.env.VITE_MOCK_ENABLED !== 'true') return;
  
  const { initMock } = await import("@/framework/mock");
  const handlers = (await import("@/apps/my-app/api/mock")).default;
  
  const worker = initMock(handlers);
  return worker.start();
}
```

## 3. Writing Mock Handlers
Handlers should be co-located with your app's API logic. The framework's `initMock` utility expects standard MSW handlers.

```typescript
// apps/my-app/api/mock/index.ts
import { http, HttpResponse } from 'msw';

export default [
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      id: 1,
      name: "John Doe",
      role: { id: "admin", name: "Administrator" }
    });
  }),
];
```

## 4. Persistence in Mocks
You can combine MSW with the framework's `storage` utility to simulate a persistent database in the browser.

```typescript
import * as storage from "@/framework/utils/storage";

http.post('/api/settings', async ({ request }) => {
  const data = await request.json();
  storage.setItem('mock_settings', data);
  return HttpResponse.json({ success: true });
});
```

---

## Next Steps
- Reference the [API Client](./api-client.md)
- Back to [Getting Started](./getting-started.md)
