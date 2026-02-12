import * as storage from "@/framework/utils/storage";
import { useCallback, useState } from "react";

/**
 * A reactive hook for managing namespaced local storage.
 * Works seamlessly with the framework's Persistence Hub.
 */
export function useStorage<T>(key: string, initialValue?: T) {
	const [storedValue, setStoredValue] = useState<T | undefined>(() => {
		const item = storage.getItem<T>(key);
		return item !== null ? item : initialValue;
	});

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

	const remove = useCallback(() => {
		setStoredValue(undefined);
		storage.removeItem(key);
	}, [key]);

	return [storedValue, setValue, remove] as const;
}
