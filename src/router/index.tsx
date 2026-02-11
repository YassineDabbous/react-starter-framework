import ProtectedRoute from "@/framework/router/components/protected-route";
import { getAuthRoute, getErrorRoute, getNoMatchedRoute } from "@/framework/router/general-routes";
import { usePermissionRoutes } from "@/framework/router/hooks";
import type { AppRouteObject, FrameworkConfig } from "@/framework/types/router";
import { Navigate, type RouteObject, createHashRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { getFrameworkSettings } from "@/framework/config";

const { homepage: HOMEPAGE } = getFrameworkSettings();

import { FrameworkConfigContext } from "@/framework/router/context";

export default function Router({ config }: { config: FrameworkConfig }) {
	const permissionRoutes = usePermissionRoutes(config.pages, config.defaultPermissions, config.components);

	return (
		<FrameworkConfigContext.Provider value={config}>
			<PROTECTED_ROUTES_ELEMENT config={config} permissionRoutes={permissionRoutes} />
		</FrameworkConfigContext.Provider>
	);
}

function PROTECTED_ROUTES_ELEMENT({ config, permissionRoutes }: { config: FrameworkConfig; permissionRoutes: AppRouteObject[] }) {
	const PROTECTED_ROUTE: AppRouteObject = {
		path: "/",
		element: (
			<ProtectedRoute loginPath={config.auth?.loginPath}>
				{config.layouts.dashboard}
			</ProtectedRoute>
		),
		children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }, ...permissionRoutes],
	};

	const AUTH_ROUTE = getAuthRoute(config);
	const ERROR_ROUTE = getErrorRoute(config);
	const NO_MATCHED_ROUTE = getNoMatchedRoute(config);

	// Filter out null routes
	const routes = [
		AUTH_ROUTE,
		ERROR_ROUTE,
		PROTECTED_ROUTE,
		NO_MATCHED_ROUTE
	].filter(Boolean) as RouteObject[];

	const router = createHashRouter(routes);

	return <RouterProvider router={router} />;
}
