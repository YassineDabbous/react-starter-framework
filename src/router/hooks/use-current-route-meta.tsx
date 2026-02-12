import { isEmpty } from "ramda";
import { useEffect, useMemo } from "react";
import { type Params, useMatches, useOutlet } from "react-router";

import { useFlattenedRoutes } from "./use-flattened-routes";
import { useRouter } from "./use-router";

import type { RouteMeta } from "../../types/router";

import { getFrameworkSettings } from "../../config";

const { homepage: HOMEPAGE } = getFrameworkSettings();
/**
 * Returns the Meta information of the current route
 */
export function useCurrentRouteMeta(): RouteMeta | undefined {
	// const pathname = usePathname();
	const { push } = useRouter();

	// Gets the route component instance
	const children = useOutlet();

	// Gets all matched routes
	const matchs = useMatches();

	// Gets the flattened route menu
	const flattenedRoutes = useFlattenedRoutes();

	const currentRouteMeta = useMemo(() => {
		// Gets the currently matched route
		const lastRoute = matchs[matchs.length - 1];
		if (!lastRoute) return undefined;

		const { pathname, params } = lastRoute;
		const matchedRouteMeta = flattenedRoutes.find((item) => {
			const replacedKey = replaceDynamicParams(item.key, params);
			return replacedKey === pathname || `${replacedKey}/` === pathname;
		});

		if (matchedRouteMeta) {
			const meta = { ...matchedRouteMeta };
			meta.outlet = children;
			if (!isEmpty(params)) {
				meta.params = params;
			}
			return meta;
		}

		// Note: We don't perform the push(HOMEPAGE) here as useMemo should be pure.
		// Redirection should be handled by a separate effect or the router itself.
		return undefined;
	}, [matchs, flattenedRoutes, children]);

	// Side effect for redirection if route not found
	useEffect(() => {
		if (!currentRouteMeta && matchs.length > 0) {
			push(HOMEPAGE);
		}
	}, [currentRouteMeta, matchs, push]);

	return currentRouteMeta;
}

/**
 * replace `user/:id`  to `/user/1234512345`
 */
export const replaceDynamicParams = (menuKey: string, params: Params<string>) => {
	let replacedPathName = menuKey;

	// Parses the parameter names in the route path
	const paramNames = menuKey.match(/:\w+/g);

	if (paramNames) {
		for (const paramName of paramNames) {
			// Removes the colon to get the parameter name
			const paramKey = paramName.slice(1);
			if (!params[paramKey]) continue;

			replacedPathName = replacedPathName.replace(paramName, params[paramKey]);
		}
	}

	return replacedPathName;
};
