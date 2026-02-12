import { ThemeMode } from "@/framework/types/enum";
import { themeVars } from "../theme.css";
import { baseThemeTokens } from "../tokens/base";
import { darkColorTokens, lightColorTokens, presetsColors } from "../tokens/color";
import { darkShadowTokens, lightShadowTokens } from "../tokens/shadow";
import { typographyTokens } from "../tokens/typography";
import type { BaseSettings } from "@/framework/types/settings";
import { useFrameworkContext } from "../../context/FrameworkContext";

export function useTheme(settings?: BaseSettings, setSettings?: (settings: any) => void) {
	const ctx = useFrameworkContext();

	const finalSettings = settings || ctx?.settings;
	const finalSetSettings = setSettings || ctx?.actions?.setSettings;

	if (!finalSettings) {
		throw new Error("useTheme must be used within a ThemeProvider or a FrameworkProvider with settings.");
	}

	let colorTokens = finalSettings.themeMode === "light" ? lightColorTokens : darkColorTokens;

	colorTokens = {
		...colorTokens,
		palette: {
			...colorTokens.palette,
			primary: presetsColors[finalSettings.themeColorPresets],
		},
	};

	return {
		mode: finalSettings.themeMode,
		settings: finalSettings,
		setMode: (mode: ThemeMode) => {
			finalSetSettings?.({
				...finalSettings,
				themeMode: mode,
			});
		},
		themeVars,
		themeTokens: {
			base: baseThemeTokens,
			color: colorTokens,
			shadow: finalSettings.themeMode === "light" ? lightShadowTokens : darkShadowTokens,
			typography: typographyTokens,
		},
	};
}
