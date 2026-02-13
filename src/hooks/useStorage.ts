import * as storage from "../utils/storage";
import { useCallback, useState } from "react";

/**
 * A reactive hook for managing namespaced local storage.
 * Works seamlessly with the framework's Persistence Hub.
 *
 * @template T - The type of the stored value
 * @param key - The unique storage key (will be automatically namespaced)
 * @param initialValue - The initial value to use if storage is empty
 * @returns {[T | undefined, (value: T | ((val: T | undefined) => T), ttl?: number) => void, () => void]} A tuple containing:
 * 1. The current stored value
 * 2. A setter function (accepts value or updater function, and optional TTL in seconds)
 * 3. A removal function to clear the specific key
 *
 * @example
 * const [theme, setTheme, removeTheme] = useStorage<string>("theme", "light");
 * setTheme("dark", 3600); // Set to dark for 1 hour
 */
export function useStorage<T>(key: string, initialValue?: T) {
	const [storedValue, setStoredValue] = useState<T | undefined>(() => {
		const item = storage.getItem<T>(key);
		return item !== null ? item : initialValue;
	});

	/**
	 * Updates the stored value and persists it to local storage.
	 *
	 * @param value - The new value or a function to update the previous value
	 * @param ttl - Optional Time-To-Live in seconds
	 */
	const setValue = useCallback(
		(value: T | ((val: T | undefined) => T), ttl?: number) => {
			try {
				const valueToStore = value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				storage.setItem(key, valueToStore, ttl);
			} catch (error) {
				console.error("useStorage Error:", error);
			}
		},
		[key, storedValue],
	);

	/**
	 * Removes the value from local storage and resets state to undefined.
	 */
	const remove = useCallback(() => {
		setStoredValue(undefined);
		storage.removeItem(key);
	}, [key]);

	return [storedValue, setValue, remove] as const;
}
