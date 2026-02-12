import { getAppContext } from "../context";
import { getFrameworkSettings } from "../config";
import type { StorageEnum } from "../types/enum";

interface StorageValue<T> {
	value: T;
	expire?: number;
}

/**
 * Automatically namespaces keys based on the current app context.
 * 
 * @throws {Error} If app context is invalid or missing
 */
const getNamespacedKey = (key: string | StorageEnum): string => {
	const context = getAppContext();

	// Validation: Ensure context has a valid ID
	if (!context || !context.id) {
		const errorMsg = 'Storage Error: App context is missing or has no ID. This could lead to namespace collisions!';
		console.error(errorMsg, { context, key });
		throw new Error(errorMsg);
	}

	// Validation: Warn if using default/fallback context (development only)
	if (import.meta.env.DEV) {
		const { appRegistry, defaultAppId } = getFrameworkSettings();
		const isDefaultApp = context.id === defaultAppId;
		const isFallback = context === appRegistry[appRegistry.length - 1];

		if (isDefaultApp || isFallback) {
			console.warn(
				'Storage Warning: Using default/fallback app context. Ensure app detection is configured correctly.',
				{ contextId: context.id, key, isDefaultApp, isFallback }
			);
		}
	}

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
/**
 * Interface for Zustand Persist Storage
 */
export interface StateStorage {
	getItem: (name: string) => string | null | Promise<string | null>;
	setItem: (name: string, value: string) => void | Promise<void>;
	removeItem: (name: string) => void | Promise<void>;
}

/**
 * Creates a namespaced storage adapter for Zustand persistence.
 */
export const createZustandStorage = (): StateStorage => ({
	getItem: (name) => getStringItem(name),
	setItem: (name, value) => {
		const namespacedKey = getNamespacedKey(name);
		localStorage.setItem(namespacedKey, value);
	},
	removeItem: (name) => {
		const namespacedKey = getNamespacedKey(name);
		localStorage.removeItem(namespacedKey);
	},
});
