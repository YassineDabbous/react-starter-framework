import { useEffect } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

/**
 * Hook to measure and report web vitals metrics.
 *
 * @param onReport - Optional callback to handle the metric data. Defaults to console.log in DEV.
 *
 * Usage:
 * ```tsx
 * usePerformance((metric) => {
 *   analytics.send(metric.name, metric.value);
 * });
 * ```
 */
export function usePerformance(onReport?: (metric: Metric) => void) {
    useEffect(() => {
        const report =
            onReport ||
            ((metric) => {
                if (import.meta.env.DEV) {
                    console.log("[Web Vitals]", metric);
                }
            });

        // Report all available metrics
        onCLS(report);
        onFCP(report);
        onINP(report);
        onLCP(report);
        onTTFB(report);
    }, [onReport]);
}
