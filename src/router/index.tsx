import ProtectedRoute from "@/framework/router/components/protected-route";
import { getAuthRoute, getErrorRoute, getNoMatchedRoute } from "@/framework/router/general-routes";
import { usePermissionRoutes } from "@/framework/router/hooks";
import type { AppRouteObject, FrameworkConfig } from "@/framework/types/router";
import { useMemo } from "react";
import { Navigate, type RouteObject, createHashRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { getFrameworkSettings } from "@/framework/config";
import { FrameworkConfigContext } from "@/framework/router/context";

export default function Router({
	config,
	permissions,
	token,
}: { config: FrameworkConfig; permissions?: any[]; token?: string | null }) {
	const permissionRoutes = usePermissionRoutes(config.pages, config.defaultPermissions, config.components, permissions);

	return (
		<FrameworkConfigContext.Provider value={config}>
			<PROTECTED_ROUTES_ELEMENT config={config} permissionRoutes={permissionRoutes} token={token} />
		</FrameworkConfigContext.Provider>
	);
}

function PROTECTED_ROUTES_ELEMENT({
	config,
	permissionRoutes,
	token,
}: { config: FrameworkConfig; permissionRoutes: AppRouteObject[]; token?: string | null }) {
	const { homepage: HOMEPAGE } = getFrameworkSettings();
	const router = useMemo(() => {
		const PROTECTED_ROUTE: AppRouteObject = {
			path: "/",
			element: (
				<ProtectedRoute loginPath={config.auth?.loginPath} accessToken={token}>
					{config.layouts.dashboard}
				</ProtectedRoute>
			),
			children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }, ...permissionRoutes],
		};

		const AUTH_ROUTE = getAuthRoute(config);
		const ERROR_ROUTE = getErrorRoute(config);
		const NO_MATCHED_ROUTE = getNoMatchedRoute(config);

		// Filter out null routes
		const routes = [AUTH_ROUTE, ERROR_ROUTE, PROTECTED_ROUTE, NO_MATCHED_ROUTE].filter(Boolean) as RouteObject[];

		return createHashRouter(routes);
	}, [config, permissionRoutes]);

	return <RouterProvider router={router} />;
}
