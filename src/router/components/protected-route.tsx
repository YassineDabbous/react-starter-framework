import { useCallback, useEffect } from "react";
import { useRouter } from "../hooks";
import { useFrameworkContext } from "../../context/FrameworkContext";

type Props = {
	children: React.ReactNode;
	loginPath?: string;
	accessToken?: string | null;
};

export default function ProtectedRoute({ children, loginPath = "/login", accessToken }: Props) {
	const router = useRouter();
	const ctx = useFrameworkContext();

	const finalAccessToken = accessToken !== undefined ? accessToken : ctx?.token;

	const check = useCallback(() => {
		if (!finalAccessToken) {
			router.replace(loginPath);
		}
	}, [router, finalAccessToken, loginPath]);

	useEffect(() => {
		check();
	}, [check]);

	if (!finalAccessToken) return null;

	// ErrorBoundary should ideally be wrapped at the app level or passed via config
	// For now, we simplify it to remove the direct app/ dependency
	return <>{children}</>;
}
