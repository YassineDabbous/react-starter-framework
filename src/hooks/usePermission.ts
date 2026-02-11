import { useMemo } from "react";
import { useUserInfo, useUserPermission } from "@/framework/store/userStore";
import { flattenTrees } from "@/framework/utils/tree";
import { BasicStatus } from "@/framework/types/enum";

export type PermissionCheck = string | string[];

/**
 * A framework-level hook for fine-grained permission checks.
 */
export function usePermission() {
    const permissions = useUserPermission();
    const userInfo = useUserInfo();

    const flattenedPermissions = useMemo(() => {
        if (!permissions) return [];
        // Only consider enabled permissions
        return flattenTrees(permissions).filter(p => p.status !== BasicStatus.DISABLE);
    }, [permissions]);

    const isSuperAdmin = useMemo(() => {
        return userInfo.role?.id === "superadmin" ||
            flattenedPermissions.some(p => p.name === "*" || p.id === "*");
    }, [userInfo.role, flattenedPermissions]);

    /**
     * Check if the user has a specific permission.
     */
    const can = (permission: PermissionCheck, mode: "AND" | "OR" = "OR"): boolean => {
        if (isSuperAdmin) return true;
        if (!permissions) return false;

        const checkList = Array.isArray(permission) ? permission : [permission];

        const results = checkList.map(p => {
            return flattenedPermissions.some(item => {
                // Exact match
                if (item.name === p || item.id === p) return true;

                // Wildcard match (e.g., item.name is 'user.*' and p is 'user.edit')
                if (item.name?.endsWith(".*")) {
                    const prefix = item.name.slice(0, -2);
                    return p.startsWith(prefix);
                }

                return false;
            });
        });

        return mode === "AND" ? results.every(res => res) : results.some(res => res);
    };

    /**
     * Check if the user has a specific role.
     */
    const is = (roleName: string): boolean => {
        return isSuperAdmin || userInfo.role?.id === roleName || userInfo.role?.name === roleName;
    };

    return {
        can,
        is,
        isSuperAdmin,
        permissions: flattenedPermissions,
    };
}
