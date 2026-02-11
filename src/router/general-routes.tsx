import type { AppRouteObject, FrameworkConfig } from "@/framework/types/router";
import { Navigate } from "react-router";

// Factory functions to create general routes using configuration
export const getAuthRoute = (config: FrameworkConfig): AppRouteObject | null => {
	if (!config.auth?.loginPage) return null;

	return {
		path: config.auth.loginPath || "/login",
		element: config.auth.loginPage,
	};
};

export const getErrorRoute = (config: FrameworkConfig): AppRouteObject | null => {
	if (!config.auth?.errorPage) return null;

	return {
		path: "/error",
		element: config.auth.errorPage,
	};
};

export const getNoMatchedRoute = (config: FrameworkConfig): AppRouteObject => {
	return {
		path: "*",
		element: <Navigate to={config.auth?.error404Path || "/404"} replace />,
	};
};
