import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { StorageEnum } from "../types/enum";
import { getStringItem } from "../utils/storage";

import { getFrameworkSettings } from "../config";

export function initI18n(resources: any) {
	const settings = getFrameworkSettings();
	const storageKey = StorageEnum.I18N;
	const defaultLng = getStringItem(storageKey) || settings.defaultLocale;

	i18n
		.use(LanguageDetector)
		.use(initReactI18next)
		.init({
			debug: true,
			lng: defaultLng,
			fallbackLng: settings.defaultLocale,
			detection: {
				// Use namespaced key for language detection and storage
				lookupLocalStorage: `${settings.storageName}_${storageKey}`,
				caches: ["localStorage"],
			},
			interpolation: {
				escapeValue: false,
			},
			resources: resources,
		});
}

export default i18n;
export const { t } = i18n;
