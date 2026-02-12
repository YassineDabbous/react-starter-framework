import { ascend } from "ramda";

import type { AppRouteObject, RouteMeta } from "../types/router";

/**
 * return menu routes
 */
export const menuFilter = (items: AppRouteObject[]) => {
	return items
		.filter((item) => {
			const show = item.meta?.key;
			if (show && item.children) {
				item.children = menuFilter(item.children);
			}
			return show;
		})
		.sort(ascend((item) => item.order || Number.POSITIVE_INFINITY));
};

/**
 * return the routes will be used in sidebar menu
 */
export function getMenuRoutes(appRouteObjects: AppRouteObject[]) {
	// return menuFilter(getMenuModules());
	return menuFilter(appRouteObjects);
}

/**
 * return flatten routes
 */
export function flattenMenuRoutes(routes: AppRouteObject[]) {
	return routes.reduce<RouteMeta[]>((prev, item) => {
		const { meta, children } = item;
		if (meta) prev.push(meta);
		if (children) prev.push(...flattenMenuRoutes(children));
		return prev;
	}, []);
}

/**
 * Resolves the component path from the pages glob.
 * Handles various prefixes (./, /, pages/, src/pages/) and extensions (.tsx, .ts, etc).
 * Also handles index files (e.g. path/to/Component -> path/to/Component/index.tsx).
 */
export function resolveComponentPath(path: string, pages: Record<string, unknown>): string | undefined {
	const cleanPath = path.replace(/^(\.\/|\/)/, "");

	// Prefixes to try (handling common Vite/project structures)
	const prefixes = ["", "./", "/", "pages/", "./pages/", "/pages/", "src/pages/", "/src/pages/"];

	// Extensions to try (including index files)
	const extensions = [
		"",
		".tsx", ".jsx", ".ts", ".js",
		"/index.tsx", "/index.jsx", "/index.ts", "/index.js"
	];

	// Generate candidates
	for (const prefix of prefixes) {
		for (const ext of extensions) {
			const candidate = `${prefix}${cleanPath}${ext}`;
			if (Object.prototype.hasOwnProperty.call(pages, candidate)) {
				return candidate;
			}
		}
	}

	return undefined;
}
