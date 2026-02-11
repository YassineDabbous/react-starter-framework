import { useSettings } from "@/framework/store/settingStore";
import { ThemeMode } from "@/framework/types/enum";
import { hexToRgbChannel, rgbAlpha } from "@/framework/utils/theme";
import { useEffect } from "react";
import { layoutClass } from "./layout.css";
import { presetsColors } from "./tokens/color";
import type { UILibraryAdapter } from "./type";
import { getFrameworkSettings } from "@/framework/config";

interface ThemeProviderProps {
	children: React.ReactNode;
	adapters?: UILibraryAdapter[];
}

export function ThemeProvider({ children, adapters = [] }: ThemeProviderProps) {
	const { themeMode, themeColorPresets, fontFamily, fontSize, direction } = useSettings();
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

	// Dynamically update theme color related CSS variables
	useEffect(() => {
		const root = window.document.documentElement;
		const primaryColors = presetsColors[themeColorPresets];
		for (const [key, value] of Object.entries(primaryColors)) {
			root.style.setProperty(`--colors-palette-primary-${key}`, value);
			root.style.setProperty(`--colors-palette-primary-${key}Channel`, hexToRgbChannel(value));
		}
		root.style.setProperty("--shadows-primary", `box-shadow: 0 8px 16px 0 ${rgbAlpha(primaryColors.default, 0.24)}`);
	}, [themeColorPresets]);

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
	const wrappedWithAdapters = adapters.reduce(
		(children, Adapter) => (
			<Adapter key={Adapter.name} mode={themeMode}>
				{children}
			</Adapter>
		),
		children,
	);

	return <div className={layoutClass}>{wrappedWithAdapters}</div>;
}
