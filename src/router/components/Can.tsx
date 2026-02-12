import { type PermissionCheck, usePermission } from "@/framework/hooks/usePermission";
import type React from "react";

interface CanProps {
	/**
	 * Permission(s) required to show the children
	 */
	perform?: PermissionCheck;
	/**
	 * Role required to show the children
	 */
	role?: string;
	/**
	 * Logical mode for multiple permissions
	 */
	mode?: "AND" | "OR";
	/**
	 * Optional fallback to show if permission is denied
	 */
	fallback?: React.ReactNode;
	children: React.ReactNode;
}

/**
 * A declarative component to guard UI elements based on framework permissions and roles.
 */
export function Can({ perform, role, mode = "OR", fallback = null, children }: CanProps) {
	const { can, is } = usePermission();

	const hasPermission = perform ? can(perform, mode) : true;
	const hasRole = role ? is(role) : true;

	if (!hasPermission || !hasRole) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
