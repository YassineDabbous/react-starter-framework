import { isEmpty } from "ramda";
import { Suspense, lazy, useMemo } from "react";
import { Navigate, Outlet } from "react-router";

import { useUserPermission } from "@/framework/store/userStore";
import { flattenTrees } from "@/framework/utils/tree";

import type { Permission } from "@/framework/types/entity";
import { BasicStatus, PermissionType } from "@/framework/types/enum";
import type { AppRouteObject, FrameworkConfig } from "@/framework/types/router";


// Removed hardcoded PAGES glob to decouple framework from app

/**
 * Normalizes component path and matches it against the PAGES glob keys.
 */
const loadComponentFromPath = (path: string, pages: Record<string, () => Promise<any>>) => {
	// Normalize the incoming path (remove leading slash if present)
	const normalizedPath = path.startsWith("/") ? path.substring(1) : path;

	// In the new system, we expect the path in the permission to match the key in the pages object
	// The app will provide the pages glob, e.g. import.meta.glob("./pages/**/*.tsx")
	// and we map the permission.component to that.

	// We try to match with several possible prefixes or the exact path.
	return pages[normalizedPath] || pages[`/${normalizedPath}`] || pages[`./${normalizedPath}`];
};

import { useFrameworkConfig } from "@/framework/router/context";

export function usePermissionRoutes(
	pagesArg?: Record<string, () => Promise<any>>,
	defaultPermissionsArg?: Permission[],
	componentsArg?: FrameworkConfig["components"]
): AppRouteObject[] {
	const config = pagesArg ? null : useFrameworkConfig();

	const pages = pagesArg || config?.pages!;
	const defaultPermissions = defaultPermissionsArg || config?.defaultPermissions!;
	const components = componentsArg || config?.components;

	const permissions = useUserPermission() || defaultPermissions;
	return useMemo(() => {
		if (!permissions) return [];

		const flattenedPermissions = flattenTrees(permissions);
		return transformPermissionsToRoutes(permissions, flattenedPermissions, pages, components);
	}, [permissions, pages, components]);
}

function transformPermissionsToRoutes(
	permissions: Permission[],
	flattenedPermissions: Permission[],
	pages: Record<string, () => Promise<any>>,
	components?: FrameworkConfig["components"]
): AppRouteObject[] {
	return permissions.map((permission) => {
		if (permission.type === PermissionType.CATALOGUE) {
			return createCatalogueRoute(permission, flattenedPermissions, pages, components);
		}
		return createMenuRoute(permission, flattenedPermissions, pages, components);
	});
}


/**
 * Build complete route path by traversing from current permission to root
 * @param {Permission} permission - current permission
 * @param {Permission[]} flattenedPermissions - flattened permission array
 * @param {string[]} segments - route segments accumulator
 * @returns {string} normalized complete route path
 */
function buildCompleteRoute(
	permission: Permission,
	flattenedPermissions: Permission[],
	segments: string[] = [],
): string {
	// Add current route segment
	segments.unshift(permission.route);

	// Base case: reached root permission
	if (!permission.parentId) {
		return `/${segments.join("/")}`;
	}

	// Find parent and continue recursion
	const parent = flattenedPermissions.find((p) => p.id === permission.parentId);
	if (!parent) {
		console.warn(`Parent permission not found for ID: ${permission.parentId}`);
		return `/${segments.join("/")}`;
	}

	return buildCompleteRoute(parent, flattenedPermissions, segments);
}



// Route Transformers
const createBaseRoute = (permission: Permission, completeRoute: string): AppRouteObject => {
	const { route, label, icon, order, hide, hideTab, status, frameSrc, newFeature } = permission;

	// Ensure the path is relative for child routes to avoid issues with absolute paths in HashRouter
	const normalizedPath = route.startsWith("/") ? route.substring(1) : route;

	const baseRoute: AppRouteObject = {
		path: normalizedPath,
		meta: {
			label,
			key: completeRoute,
			hideMenu: !!hide,
			hideTab,
			disabled: status === BasicStatus.DISABLE,
		},
	};

	if (order) baseRoute.order = order;

	if (baseRoute.meta) {
		baseRoute.meta.newFeature = newFeature;
		if (icon) baseRoute.meta.icon = icon;
		if (frameSrc) baseRoute.meta.frameSrc = frameSrc;
	}

	return baseRoute;
};

const createCatalogueRoute = (
	permission: Permission,
	flattenedPermissions: Permission[],
	pages: Record<string, () => Promise<any>>,
	components?: FrameworkConfig["components"]
): AppRouteObject => {
	const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

	if (baseRoute.meta) {
		baseRoute.meta.hideTab = true;
	}

	const { parentId, children = [] } = permission;
	if (!parentId) {
		baseRoute.element = (
			<Suspense fallback={components?.circleLoading}>
				<Outlet />
			</Suspense>
		);
	}

	baseRoute.children = transformPermissionsToRoutes(children, flattenedPermissions, pages, components);

	if (!isEmpty(children)) {
		baseRoute.children.unshift({
			index: true,
			element: <Navigate to={children[0].route} replace />,
		});
	}

	return baseRoute;
};

const createMenuRoute = (
	permission: Permission,
	flattenedPermissions: Permission[],
	pages: Record<string, () => Promise<any>>,
	components?: FrameworkConfig["components"]
): AppRouteObject => {
	const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

	if (permission.component) {
		const loadFn = loadComponentFromPath(permission.component, pages);
		if (loadFn) {
			const Element = lazy(loadFn as any);

			if (permission.frameSrc) {
				baseRoute.element = <Element src={permission.frameSrc} />;
			} else {
				baseRoute.element = (
					<Suspense fallback={components?.circleLoading}>
						<Element />
					</Suspense>
				);
			}
		} else {
			console.error(`Component not found at path: ${permission.component}`);
		}
	}

	// Support children even for MENU types (e.g. sub-menu items)
	if (permission.children && permission.children.length > 0) {
		baseRoute.children = transformPermissionsToRoutes(permission.children, flattenedPermissions, pages, components);
	}

	return baseRoute;
};
