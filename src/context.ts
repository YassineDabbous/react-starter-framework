import { getFrameworkSettings } from "./config";
import type { AppConfig } from "./types/app";

export function getAppContext(): AppConfig {
    const { hostname, pathname } = window.location;
    const { appRegistry } = getFrameworkSettings();

    // Find the first app that matches the current environment
    const currentApp = appRegistry.find(app => {
        if (app.hostPrefix && hostname.startsWith(app.hostPrefix)) return true;
        if (app.pathPrefix && app.pathPrefix !== '/' && pathname.startsWith(app.pathPrefix)) return true;
        return false;
    });

    // Return the matched app or the default (usually the last one or 'student')
    return currentApp || appRegistry.find(app => app.id === 'student') || appRegistry[appRegistry.length - 1];
}

export function getAppBasePath(context: AppConfig): string {
    return context.pathPrefix || '/';
}
