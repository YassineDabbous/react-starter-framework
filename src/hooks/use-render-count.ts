import { useEffect, useRef } from "react";

/**
 * Hook to count and log the number of times a component renders.
 * Useful for performance debugging/profiling.
 *
 * @param componentName - Name of the component to log.
 *
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   useRenderCount("MyComponent");
 *   return <div>...</div>;
 * }
 * ```
 */
export function useRenderCount(componentName: string) {
    const count = useRef(0);

    useEffect(() => {
        count.current += 1;
        if (import.meta.env.DEV) {
            console.log(`[RenderCount] ${componentName}: ${count.current}`);
        }
    }); // Intentionally no dependency array to run on every render
}
