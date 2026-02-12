import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse, type AxiosInstance } from "axios";

import { t } from "../locales/i18n";

import type { Result } from "../types/api";
import { toast } from "sonner";

export class ApiException extends Error {
	constructor(
		public message: string,
		public status?: number,
		public code?: string,
	) {
		super(message);
		this.name = "ApiException";
	}
}

export class AuthException extends ApiException {
	constructor(message: string) {
		super(message, 401, "UNAUTHORIZED");
		this.name = "AuthException";
	}
}

export class NetworkException extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NetworkException";
	}
}

export function _cleanParams(params: { [key: string]: any }) {
	// console.log('dirty', params);
	const o = Object.entries(params).reduce((a: { [key: string]: any }, [k, v]) => {
		// return (v == null ? a : (a[k]=v, a));
		if (v == null || v === "") {
			return a;
		}
		a[k] = v;
		return a;
	}, {});
	// console.log('clean', o);
	return o;
}
export function _route(url: string, params: { [key: string]: any }) {
	return Object.keys(params).reduce((prev, key) => prev.replace(`:${key}`, params[key].toString()), url);
}

export interface PaginationResponse<T> {
	items: T[];
	page: number;
	pageSize: number;
	total: number;
}

import { getFrameworkSettings } from "../config";

export type TokenProvider = () => string | null | undefined;
export type OnAuthError = (message: string) => void;

export interface ApiClientConfig {
	baseURL?: string;
	timeout?: number;
	tokenProvider?: TokenProvider;
	onAuthError?: OnAuthError;
}

class APIClient {
	private axiosInstance: AxiosInstance;
	private tokenProvider: TokenProvider;
	private onAuthError: OnAuthError;

	constructor(config: ApiClientConfig = {}) {
		this.tokenProvider = config.tokenProvider || (() => null);
		this.onAuthError = config.onAuthError || (() => { });

		const settings = getFrameworkSettings();

		this.axiosInstance = axios.create({
			baseURL: config.baseURL || settings.baseApi || "",
			timeout: config.timeout || 50000,
			headers: { "Content-Type": "application/json;charset=utf-8" },
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		// Request interception
		this.axiosInstance.interceptors.request.use(
			(config) => {
				const settings = getFrameworkSettings();
				if (!config.baseURL) config.baseURL = settings.baseApi;

				const accessToken = this.tokenProvider();
				if (accessToken) {
					config.headers.Authorization = `Bearer ${accessToken}`;
				}
				return config;
			},
			(error) => {
				// What to do when a request fails
				return Promise.reject(error);
			},
		);

		// Response Interception
		this.axiosInstance.interceptors.response.use(
			(res: AxiosResponse) => {
				if (!res.data && res.status !== 204 && res.status !== 201) {
					throw new ApiException(t("sys.api.apiRequestFailed"));
				}
				return res.data;
			},
			(error: AxiosError<Result>) => {
				const { response, message } = error || {};

				let errMsg = response?.data?.message || message || t("sys.api.errorMessage");

				if (Array.isArray(errMsg)) {
					errMsg = errMsg.join(" | ");
				}

				toast.error(errMsg, {
					position: "top-center",
				});

				const status = response?.status;
				if (status === 401) {
					this.onAuthError(errMsg);
					return Promise.reject(new AuthException(errMsg));
				}

				if (!response) {
					return Promise.reject(new NetworkException(errMsg));
				}

				return Promise.reject(new ApiException(errMsg, status));
			},
		);
	}

	/**
	 * Update the token provider dynamically.
	 * Useful when token changes after client creation.
	 */
	setTokenProvider(provider: TokenProvider) {
		this.tokenProvider = provider;
	}

	/**
	 * Update the auth error handler dynamically.
	 * Useful when handler changes after client creation.
	 */
	setOnAuthError(handler: OnAuthError) {
		this.onAuthError = handler;
	}

	get<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "GET" });
	}

	post<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "POST" });
	}

	put<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PUT" });
	}

	patch<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PATCH" });
	}

	delete<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "DELETE" });
	}

	request<T = any>(config: AxiosRequestConfig): Promise<T> {
		return new Promise((resolve, reject) => {
			this.axiosInstance
				.request<any, AxiosResponse<Result>>(config)
				.then((res: AxiosResponse<Result>) => {
					resolve(res as unknown as Promise<T>);
				})
				.catch((e: Error | AxiosError) => {
					reject(e);
				});
		});
	}
}

/**
 * Factory function to create a new API client instance.
 * Recommended for better testability and SSR compatibility.
 * 
 * @param config - Configuration for the API client
 * @returns A new APIClient instance
 * 
 * @example
 * ```typescript
 * const apiClient = createApiClient({
 *   tokenProvider: () => getToken(),
 *   onAuthError: () => logout(),
 * });
 * ```
 */
export function createApiClient(config?: ApiClientConfig): APIClient {
	return new APIClient(config);
}

/**
 * Default singleton instance for backward compatibility.
 * 
 * @deprecated Use createApiClient() instead for better testability and SSR support.
 * This singleton will be removed in a future version.
 */
export default new APIClient();

