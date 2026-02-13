# API Client

The framework provides a standardized **BaseApiClient** built on top of **Axios**, ensuring consistent error handling, token injection, and request/response management.

## 1. Usage
Extend the `BaseApiClient` to create specific service clients:

```typescript
 import { createApiClient, BaseApiClient } from "@/framework";

 class UserClient extends BaseApiClient {
   async getProfile() {
     return this.get("/user/profile");
   }
 }

 // Create specialized client
 export const userClient = new UserClient(createApiClient({
   baseURL: "/api/v2" 
 }));
 ```

## 2. Token Injection
The client automatically retrieves the `accessToken` from the **FrameworkContext**.

### Automatic Configuration
When you initialize the app using `FrameworkProvider`, it handles token injection automatically via the `createReactQueryClient` factory or `APIClient` configuration.

```typescript
const client = createApiClient({
  tokenProvider: () => localStorage.getItem('token'),
  onAuthError: () => window.location.href = '/login'
});
```

**Note**: The framework's default setup in `src/main.tsx` configures this for you globally.

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
