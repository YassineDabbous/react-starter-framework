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
	 * Subscribe to an event
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
	 * Unsubscribe from an event
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
	 * Emit an event
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
	 * Clear all handlers for an event
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
