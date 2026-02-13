import type { AppRegistry, AppThemeConfig } from "./types/app";

export interface FrameworkSettings {
	storageName: string;
	baseApi: string;
	homepage: string;
	defaultLocale: string;
	appRegistry: AppRegistry;
	defaultAppId?: string;
	superAdminRole?: string;
	theme?: AppThemeConfig;
}

let settings: FrameworkSettings = {
	storageName: "app",
	baseApi: "",
	homepage: "/",
	defaultLocale: "en_US",
	appRegistry: [],
	superAdminRole: "superadmin",
};

export function initFramework(newSettings: Partial<FrameworkSettings>) {
	settings = { ...settings, ...newSettings };
}

export function getFrameworkSettings() {
	return settings;
}

export function validateFrameworkConfig() {
	const errors: string[] = [];
	const { appRegistry, baseApi, defaultLocale } = settings;

	if (!appRegistry || appRegistry.length === 0) {
		errors.push("Framework configuration error: 'appRegistry' must be a non-empty array.");
	}

	if (!baseApi) {
		errors.push("Framework configuration error: 'baseApi' is required.");
	}

	if (!defaultLocale) {
		errors.push("Framework configuration error: 'defaultLocale' is required.");
	}

	if (errors.length > 0) {
		throw new Error(errors.join("\n"));
	}
}
