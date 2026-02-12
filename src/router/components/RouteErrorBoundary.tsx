import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error boundary for route components.
 * Catches errors during lazy loading and rendering of route components.
 */
export class RouteErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Route Error Boundary caught an error:", error, errorInfo);
    }

    reset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.reset);
            }

            return <DefaultErrorFallback error={this.state.error} reset={this.reset} />;
        }

        return this.props.children;
    }
}

interface FallbackProps {
    error: Error;
    reset: () => void;
}

/**
 * Default error fallback UI for route errors.
 */
function DefaultErrorFallback({ error, reset }: FallbackProps) {
    const isChunkError = error.message?.includes("Failed to fetch dynamically imported module") ||
        error.message?.includes("Importing a module script failed");

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                padding: "2rem",
                textAlign: "center",
            }}
        >
            <div style={{ maxWidth: "500px" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
                    {isChunkError ? "Failed to Load Page" : "Something Went Wrong"}
                </h2>
                <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                    {isChunkError
                        ? "The page failed to load. This might be due to a network issue or an outdated version."
                        : error.message || "An unexpected error occurred while loading this page."}
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                    <button
                        onClick={reset}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                        }}
                    >
                        Try Again
                    </button>
                    {isChunkError && (
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#6b7280",
                                color: "white",
                                border: "none",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                            }}
                        >
                            Reload Page
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
