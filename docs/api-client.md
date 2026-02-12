# API Client

The framework provides a standardized **BaseApiClient** built on top of **Axios**, ensuring consistent error handling, token injection, and request/response management.

## 1. Usage
Extend the `BaseApiClient` to create specific service clients:

```typescript
import { BaseApiClient } from "@/framework";

class UserClient extends BaseApiClient {
  async getProfile() {
    return this.get("/user/profile");
  }
}

export const userClient = new UserClient();
```

## 2. Token Injection
The client automatically retrieves the `accessToken` from the **FrameworkContext**.

### Automatic Configuration
When you wrap your app with `FrameworkProvider`, it automatically syncs the token:

```tsx
<FrameworkProvider token={myToken} ...>
  <App />
</FrameworkProvider>
```

The `BaseApiClient` listens to this context and injects the `Authorization` header for every request:

```typescript
// Internal logic (handled automatically)
config.headers.Authorization = `Bearer ${token}`;
```

**Note**: You do not need to manually configure the token provider unless you are using the API client outside of the React tree.

## 3. Error Handling
The client includes built-in interceptors to handle common scenarios:

- **401 Unauthorized**: Automatically clears the user session and redirects to the login page.
- **Validation Errors**: Aggregates array-based error messages into a single, toasted notification.
- **Network Failures**: Provides user-friendly messages for offline states.

## 4. Environment Configuration
The base URL is determined during initialization:

```typescript
initFramework({
  baseApi: import.meta.env.VITE_APP_BASE_API || "/api"
});
```

---

## Next Steps
- Back to [Getting Started](./getting-started.md)
- Learn about [Architecture](./architecture.md)
