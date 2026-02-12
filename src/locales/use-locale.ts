import { getFrameworkSettings } from "@/framework/config";
import { useSettingActions } from "@/framework/store/settingStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface Language {
	locale: string;
	label: string;
	icon: string;
	direction: "ltr" | "rtl";
}

/**
 * Enhanced locale hook that syncs the document direction attribute.
 */
export default function useLocale() {
	const { i18n } = useTranslation();
	const { defaultLocale } = getFrameworkSettings();
	const { setDirection } = useSettingActions();

	const locale = i18n.resolvedLanguage || defaultLocale;

	// Automatically sync the HTML dir attribute and settings
	useEffect(() => {
		const rtlLocales = ["ar", "he", "fa", "ur"];
		const direction = rtlLocales.some((rtl) => locale.startsWith(rtl)) ? "rtl" : "ltr";

		document.documentElement.dir = direction;
		document.documentElement.lang = locale;

		setDirection(direction);
	}, [locale, setDirection]);

	const setLocale = (newLocale: string) => {
		i18n.changeLanguage(newLocale);
	};

	return {
		locale,
		setLocale,
	};
}
