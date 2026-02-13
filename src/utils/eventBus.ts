import { useEffect } from "react";
import type { FrameworkEventMap } from "../types/events";

// Allow augmenting the event map
export interface EventMap extends FrameworkEventMap { }

type EventKey = keyof EventMap;
type EventHandler<K extends EventKey> = (data: EventMap[K]) => void;

/**
 * A lightweight, type-safe event bus for the framework.
 * Allows decoupled communication between apps or components.
 */
class EventBus {
	private handlers: Map<EventKey, Set<EventHandler<any>>> = new Map();

	/**
	 * Subscribe to an event.
	 *
	 * @param event - The name of the event to subscribe to.
	 * @param handler - The callback function to execute when the event is emitted.
	 * @returns {Function} An unsubscribe function that removes the handler when called.
	 *
	 * @example
	 * const unsubscribe = eventBus.on("auth:login", (data) => {
	 *   console.log("User logged in:", data.user);
	 * });
	 * // Later...
	 * unsubscribe();
	 */
	on<K extends EventKey>(event: K, handler: EventHandler<K>): () => void {
		if (!this.handlers.has(event)) {
			this.handlers.set(event, new Set());
		}
		this.handlers.get(event)!.add(handler);

		// Return unsubscribe function
		return () => this.off(event, handler);
	}

	/**
	 * Unsubscribe from an event.
	 *
	 * @param event - The name of the event.
	 * @param handler - The specific handler function to remove.
	 */
	off<K extends EventKey>(event: K, handler: EventHandler<K>): void {
		const set = this.handlers.get(event);
		if (set) {
			set.delete(handler);
			if (set.size === 0) {
				this.handlers.delete(event);
			}
		}
	}

	/**
	 * Emit an event to all subscribed handlers.
	 *
	 * @param event - The name of the event to emit.
	 * @param data - The data payload associated with the event. Type-checked against FrameworkEventMap.
	 *
	 * @example
	 * eventBus.emit("theme:changed", { theme: "dark" });
	 */
	emit<K extends EventKey>(event: K, data: EventMap[K]): void {
		const set = this.handlers.get(event);
		if (set) {
			for (const handler of set) {
				try {
					handler(data);
				} catch (error) {
					console.error(`Error in event bus handler for "${event}":`, error);
				}
			}
		}
	}

	/**
	 * Clear all handlers for a specific event.
	 * Use with caution as it removes all listeners, including those from other parts of the app.
	 *
	 * @param event - The event name to clear.
	 */
	clear(event: EventKey): void {
		this.handlers.delete(event);
	}
}

export const eventBus = new EventBus();

/**
 * React hook to safely use the event bus within components
 */
export function useEvent<K extends EventKey>(event: K, handler: EventHandler<K>) {
	useEffect(() => {
		return eventBus.on(event, handler);
	}, [event, handler]);
}
