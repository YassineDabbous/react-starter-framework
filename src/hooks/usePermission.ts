import type { BaseUserInfo } from "../types/entity";
import { BasicStatus } from "../types/enum";
import { flattenTrees } from "../utils/tree";
import { useMemo } from "react";
import { getFrameworkSettings } from "../config";
import { useFrameworkContext } from "../context/FrameworkContext";

export type PermissionCheck = string | string[];

/**
 * A framework-level hook for fine-grained permission checks.
 * Decoupled from the store; requires data to be passed in.
 *
 * @param userInfo - The user object containing role information. If undefined, defaults to context user.
 * @param permissions - The list of permissions. If undefined, defaults to context permissions.
 * @returns {Object} Permission helpers
 *
 * @example
 * const { can, is, isSuperAdmin } = usePermission();
 *
 * if (can("user.create")) {
 *   // ...
 * }
 *
 * if (is("admin")) {
 *   // ...
 * }
 */
export function usePermission(userInfo?: BaseUserInfo | null, permissions?: any[] | null | undefined) {
	const ctx = useFrameworkContext();
	const { superAdminRole } = getFrameworkSettings();

	const finalUserInfo = userInfo !== undefined ? userInfo : ctx?.user;
	const finalPermissions = permissions !== undefined ? permissions : ctx?.user?.permissions;

	const flattenedPermissions = useMemo(() => {
		if (!finalPermissions) return [];
		return flattenTrees(finalPermissions).filter((p) => p.status !== BasicStatus.DISABLE);
	}, [finalPermissions]);

	const isSuperAdmin = useMemo(() => {
		if (!finalUserInfo) return false;
		const userRole = finalUserInfo.role;
		return userRole?.id === superAdminRole || flattenedPermissions.some((p) => p.name === "*" || p.id === "*");
	}, [finalUserInfo, flattenedPermissions, superAdminRole]);

	/**
	 * Checks if the user has a specific permission.
	 *
	 * @param permission - The permission string or array of strings to check.
	 * @param mode - The logic mode ("AND" | "OR") when checking multiple permissions. Defaults to "OR".
	 * @returns {boolean} True if the user has the permission(s).
	 */
	const can = (permission: PermissionCheck, mode: "AND" | "OR" = "OR"): boolean => {
		if (isSuperAdmin) return true;
		if (flattenedPermissions.length === 0) return false;

		const checkList = Array.isArray(permission) ? permission : [permission];

		const results = checkList.map((p) => {
			return flattenedPermissions.some((item) => {
				if (item.name === p || item.id === p) return true;
				if (item.name?.endsWith(".*")) {
					const prefix = item.name.slice(0, -2);
					return p.startsWith(prefix);
				}
				return false;
			});
		});

		return mode === "AND" ? results.every((res) => res) : results.some((res) => res);
	};

	/**
	 * Checks if the user has a specific role.
	 *
	 * @param roleName - The role ID or name to check against.
	 * @returns {boolean} True if the user has the role.
	 */
	const is = (roleName: string): boolean => {
		if (!finalUserInfo) return false;
		const userRole = finalUserInfo.role;
		return isSuperAdmin || userRole?.id === roleName || userRole?.name === roleName;
	};

	return {
		can,
		is,
		isSuperAdmin,
		permissions: flattenedPermissions,
	};
}
