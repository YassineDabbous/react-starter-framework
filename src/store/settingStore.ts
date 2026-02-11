import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { FontFamilyPreset, typographyTokens } from "@/framework/theme/tokens/typography";
import { StorageEnum, ThemeColorPresets, ThemeLayout, ThemeMode } from "@/framework/types/enum";
import { getFrameworkSettings } from "@/framework/config";

export type SettingsType = {
	themeColorPresets: ThemeColorPresets;
	themeMode: ThemeMode;
	themeLayout: ThemeLayout;
	themeStretch: boolean;
	breadCrumb: boolean;
	multiTab: boolean;
	darkSidebar: boolean;
	fontFamily: string;
	fontSize: number;
	direction: "ltr" | "rtl";
};
type SettingStore = {
	settings: SettingsType;
	actions: {
		setSettings: (settings: SettingsType) => void;
		setDirection: (direction: "ltr" | "rtl") => void;
		clearSettings: () => void;
	};
};

const INITIAL_SETTINGS: SettingsType = {
	themeColorPresets: ThemeColorPresets.Default,
	themeMode: ThemeMode.Light,
	themeLayout: ThemeLayout.Vertical,
	themeStretch: false,
	breadCrumb: true,
	multiTab: true,
	darkSidebar: false,
	fontFamily: FontFamilyPreset.rubik,
	fontSize: Number(typographyTokens.fontSize.sm),
	direction: "ltr",
};

const useSettingStore = create<SettingStore>()(
	persist(
		(set) => ({
			settings: INITIAL_SETTINGS,
			actions: {
				setSettings: (settings) => {
					set({ settings });
				},
				setDirection: (direction) => {
					set((state) => ({ settings: { ...state.settings, direction } }));
				},
				clearSettings() {
					useSettingStore.persist.clearStorage();
				},
			},
		}),
		{
			name: `${getFrameworkSettings().storageName}-settings`,
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
			partialize: (state) => ({ [StorageEnum.Settings]: state.settings }),
		},
	),
);

export const useSettings = () => useSettingStore((state) => state.settings);
export const useSettingActions = () => useSettingStore((state) => state.actions);

export default useSettingStore;