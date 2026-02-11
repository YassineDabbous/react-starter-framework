type Handler<T = any> = (data: T) => void;

/**
 * A lightweight, type-safe event bus for the framework.
 * Allows decoupled communication between apps or components.
 */
class EventBus {
    private handlers: Map<string, Set<Handler>> = new Map();

    /**
     * Subscribe to an event
     */
    on<T = any>(event: string, handler: Handler<T>): () => void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler);

        // Return unsubscribe function
        return () => this.off(event, handler);
    }

    /**
     * Unsubscribe from an event
     */
    off<T = any>(event: string, handler: Handler<T>): void {
        const set = this.handlers.get(event);
        if (set) {
            set.delete(handler);
            if (set.size === 0) {
                this.handlers.delete(event);
            }
        }
    }

    /**
     * Emit an event
     */
    emit<T = any>(event: string, data?: T): void {
        const set = this.handlers.get(event);
        if (set) {
            set.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event bus handler for "${event}":`, error);
                }
            });
        }
    }

    /**
     * Clear all handlers for an event
     */
    clear(event: string): void {
        this.handlers.delete(event);
    }
}

export const eventBus = new EventBus();

/**
 * React hook to safely use the event bus within components
 */
import { useEffect } from "react";

export function useEvent<T = any>(event: string, handler: Handler<T>) {
    useEffect(() => {
        return eventBus.on(event, handler);
    }, [event, handler]);
}
