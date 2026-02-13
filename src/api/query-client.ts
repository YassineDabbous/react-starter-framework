import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

/**
 * Creates a configured QueryClient instance with framework defaults.
 * 
 * Features:
 * - Smart retry logic (skips 401 Unauthorized)
 * - Reasonable default staleTime (5 minutes)
 * - No retries for mutations
 */
export function createReactQueryClient(config?: QueryClientConfig) {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes
                refetchOnWindowFocus: false, // Better DX for development
                retry: (failureCount, error: any) => {
                    // Don't retry on 401 Unauthorized as it requires user action (login)
                    if (error?.status === 401 || error?.response?.status === 401) {
                        return false;
                    }

                    // Don't retry custom exceptions that are marked as non-retryable
                    if (error?.isRetryable === false) {
                        return false;
                    }

                    // Default to 3 retries
                    return failureCount < 3;
                },
            },
            mutations: {
                // Don't retry mutations by default to prevent side effects
                retry: false,
            },
        },
        ...config,
    });
}
