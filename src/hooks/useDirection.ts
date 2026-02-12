import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFrameworkContext } from "../context/FrameworkContext";

export type Direction = "ltr" | "rtl";

/**
 * A framework-level hook to detect the current layout direction.
 * This works independently of any UI library.
 */
export function useDirection(settingsDirection?: Direction) {
	const { i18n } = useTranslation();
	const ctx = useFrameworkContext();

	const finalSettingsDirection = settingsDirection || ctx?.settings?.direction;

	const direction = useMemo((): Direction => {
		// 1. If settings specifically define a direction, use it
		if (finalSettingsDirection) return finalSettingsDirection;

		// 2. Default to detection based on common RTL language codes
		const lng = i18n.resolvedLanguage || i18n.language || "en";
		const rtlLocales = ["ar", "he", "fa", "ur", "syr", "ku", "ps", "sd"];

		return rtlLocales.some((rtl) => lng.startsWith(rtl)) ? "rtl" : "ltr";
	}, [finalSettingsDirection, i18n.resolvedLanguage, i18n.language]);

	return {
		direction,
		isRtl: direction === "rtl",
		isLtr: direction === "ltr",
	};
}
