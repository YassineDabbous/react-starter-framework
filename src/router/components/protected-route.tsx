import { useCallback, useEffect } from "react";

import { useUserToken } from "@/framework/store/userStore";
import { useRouter } from "../hooks";

type Props = {
	children: React.ReactNode;
	loginPath?: string;
};

export default function ProtectedRoute({ children, loginPath = "/login" }: Props) {
	const router = useRouter();
	const { accessToken } = useUserToken();

	const check = useCallback(() => {
		if (!accessToken) {
			router.replace(loginPath);
		}
	}, [router, accessToken, loginPath]);

	useEffect(() => {
		check();
	}, [check]);

	if (!accessToken) return null;

	// ErrorBoundary should ideally be wrapped at the app level or passed via config
	// For now, we simplify it to remove the direct app/ dependency
	return <>{children}</>;
}
