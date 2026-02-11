import { getAppContext } from "@/framework/context";
import type { StorageEnum } from "@/framework/types/enum";

interface StorageValue<T> {
	value: T;
	expire?: number;
}

/**
 * Automatically namespaces keys based on the current app context.
 */
const getNamespacedKey = (key: string | StorageEnum): string => {
	const context = getAppContext();
	return `${context.id}_${key}`;
};

export const getItem = <T>(key: StorageEnum | string): T | null => {
	try {
		const namespacedKey = getNamespacedKey(key);
		const result = window.localStorage.getItem(namespacedKey);
		if (!result) return null;

		const storageValue: StorageValue<T> = JSON.parse(result);

		// Check TTL
		if (storageValue.expire && storageValue.expire < Date.now()) {
			window.localStorage.removeItem(namespacedKey);
			return null;
		}

		return storageValue.value;
	} catch (error) {
		console.error("Storage Error:", error);
		return null;
	}
};

export const getStringItem = (key: StorageEnum | string): string | null => {
	const namespacedKey = getNamespacedKey(key);
	return localStorage.getItem(namespacedKey);
};

/**
 * Set item with optional TTL (in seconds)
 */
export const setItem = <T>(key: StorageEnum | string, value: T, ttl?: number): void => {
	const namespacedKey = getNamespacedKey(key);
	const storageValue: StorageValue<T> = {
		value,
		expire: ttl ? Date.now() + ttl * 1000 : undefined,
	};
	localStorage.setItem(namespacedKey, JSON.stringify(storageValue));
};

export const removeItem = (key: StorageEnum | string): void => {
	const namespacedKey = getNamespacedKey(key);
	localStorage.removeItem(namespacedKey);
};

export const clearItems = () => {
	localStorage.clear();
};

// Session Storage Helpers
export const setSessionItem = <T>(key: StorageEnum | string, value: T): void => {
	const namespacedKey = getNamespacedKey(key);
	sessionStorage.setItem(namespacedKey, JSON.stringify(value));
};

export const getSessionItem = <T>(key: StorageEnum | string): T | null => {
	const namespacedKey = getNamespacedKey(key);
	const result = sessionStorage.getItem(namespacedKey);
	return result ? JSON.parse(result) : null;
};
