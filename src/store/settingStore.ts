import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { StorageEnum } from "../types/enum";
import type { BaseSettings } from "../types/settings";
import { createZustandStorage } from "../utils/storage";

/**
 * Represents the state and actions of the Settings Store.
 * @template T - The specific settings type extending BaseSettings.
 */
export type SettingStoreState<T extends BaseSettings> = {
	settings: T;
	actions: {
		setSettings: (settings: T) => void;
		setDirection: (direction: "ltr" | "rtl") => void;
		clearSettings: () => void;
	};
};

/**
 * Factory to create an app-aware settings store.
 * Persists settings to local storage with namespace isolation.
 *
 * @template T - The specific settings type for the application.
 * @param initialSettings - The default settings to use if storage is empty.
 * @returns A Zustand store hook.
 *
 * @example
 * const useSettingStore = createSettingStore<MySettings>({ theme: 'dark', ... });
 * const { settings } = useSettingStore();
 */
export const createSettingStore = <T extends BaseSettings>(initialSettings: T) => {
	const useStore = create<SettingStoreState<T>>()(
		persist(
			(set) => ({
				settings: initialSettings,
				actions: {
					setSettings: (settings) => {
						set({ settings });
					},
					setDirection: (direction) => {
						set((state) => ({ settings: { ...state.settings, direction } }));
					},
					clearSettings() {
						useStore.persist.clearStorage();
					},
				},
			}),
			{
				name: StorageEnum.Settings,
				storage: createJSONStorage(() => createZustandStorage()),
				partialize: (state) => ({ [StorageEnum.Settings]: state.settings }),
			},
		),
	);
	return useStore;
};
