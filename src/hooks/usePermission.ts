import type { BaseUserInfo } from "../types/entity";
import { BasicStatus } from "@/framework/types/enum";
import { flattenTrees } from "@/framework/utils/tree";
import { useMemo } from "react";
import { getFrameworkSettings } from "@/framework/config";
import { useFrameworkContext } from "../context/FrameworkContext";

export type PermissionCheck = string | string[];

/**
 * A framework-level hook for fine-grained permission checks.
 * Decoupled from the store; requires data to be passed in.
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
		return (finalUserInfo as any).role?.id === superAdminRole || flattenedPermissions.some((p) => p.name === "*" || p.id === "*");
	}, [finalUserInfo, flattenedPermissions, superAdminRole]);

	const can = (permission: PermissionCheck, mode: "AND" | "OR" = "OR"): boolean => {
		if (isSuperAdmin) return true;
		if (!permissions) return false;

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

	const is = (roleName: string): boolean => {
		if (!finalUserInfo) return false;
		return isSuperAdmin || (finalUserInfo as any).role?.id === roleName || (finalUserInfo as any).role?.name === roleName;
	};

	return {
		can,
		is,
		isSuperAdmin,
		permissions: flattenedPermissions,
	};
}
