import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getFrameworkSettings } from "../config";

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
	const locale = i18n.resolvedLanguage || defaultLocale;

	// Automatically sync the HTML dir and lang attributes
	useEffect(() => {
		const rtlLocales = ["ar", "he", "fa", "ur"];
		const direction = rtlLocales.some((rtl) => locale.startsWith(rtl)) ? "rtl" : "ltr";

		document.documentElement.dir = direction;
		document.documentElement.lang = locale;
	}, [locale]);

	const setLocale = (newLocale: string) => {
		i18n.changeLanguage(newLocale);
	};

	return {
		locale,
		setLocale,
	};
}
