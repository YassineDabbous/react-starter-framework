import { getFrameworkSettings } from "../config";
import { ThemeMode } from "../types/enum";
import { hexToRgbChannel, rgbAlpha } from "../utils/theme";
import { useEffect, useMemo, useState } from "react";
import { layoutClass } from "./layout.css";
import { presetsColors } from "./tokens/color";
import type { UILibraryAdapter } from "./type";
import type { BaseSettings } from "../types/settings";

const useHasHydrated = () => {
	const [hasHydrated, setHasHydrated] = useState(false);

	useEffect(() => {
		setHasHydrated(true);
	}, []);

	return hasHydrated;
};

import { useTheme } from "./hooks/use-theme";

interface ThemeProviderProps {
	children: React.ReactNode;
	adapters?: UILibraryAdapter[];
	settings?: BaseSettings;
}

export function ThemeProvider({ children, adapters = [], settings }: ThemeProviderProps) {
	const hasHydrated = useHasHydrated();
	const { settings: finalSettings } = useTheme(settings);

	const {
		themeMode,
		themeColorPresets,
		fontSize,
		fontFamily,
		direction,
	} = finalSettings;

	const { theme } = getFrameworkSettings();

	// Update app-specific font CSS variables
	useEffect(() => {
		const root = window.document.documentElement;
		if (theme?.fontFamily?.primary) {
			root.style.setProperty("--app-font-primary", theme.fontFamily.primary);
		}
		if (theme?.fontFamily?.secondary) {
			root.style.setProperty("--app-font-secondary", theme.fontFamily.secondary);
		}
	}, [theme]);

	// Update HTML class to support Tailwind dark mode and direction
	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove(ThemeMode.Light, ThemeMode.Dark);
		root.classList.add(themeMode);
		root.dir = direction;
	}, [themeMode, direction]);

	// Memoize primary colors to avoid object lookup in effect if not needed
	const primaryColors = useMemo(() => presetsColors[themeColorPresets], [themeColorPresets]);

	// Dynamically update theme color related CSS variables
	useEffect(() => {
		const root = window.document.documentElement;
		for (const [key, value] of Object.entries(primaryColors)) {
			root.style.setProperty(`--colors-palette-primary-${key}`, value);
			root.style.setProperty(`--colors-palette-primary-${key}Channel`, hexToRgbChannel(value));
		}
		root.style.setProperty("--shadows-primary", `box-shadow: 0 8px 16px 0 ${rgbAlpha(primaryColors.default, 0.24)}`);
	}, [primaryColors]);

	// Update font size and font family
	useEffect(() => {
		const root = window.document.documentElement;
		root.style.fontSize = `${fontSize}px`;

		const body = window.document.body;
		body.style.fontFamily = fontFamily;
	}, [fontFamily, fontSize]);

	/**
	 * Wrap children with adapters:
	 * <adapter1>
	 * 	<adapter2>
	 * 		{children}
	 * 	</adapter2>
	 * </adapter1>
	 */
	const wrappedWithAdapters = useMemo(() => {
		return adapters.reduce(
			(children, Adapter) => (
				<Adapter key={Adapter.name} mode={themeMode}>
					{children}
				</Adapter>
			),
			children,
		);
	}, [adapters, children, themeMode]);

	if (!hasHydrated) {
		return <div className={layoutClass} style={{ visibility: "hidden" }}>{children}</div>;
	}

	return <div className={layoutClass}>{wrappedWithAdapters}</div>;
}
