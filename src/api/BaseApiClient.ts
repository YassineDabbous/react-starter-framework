import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";

import { t } from "@/framework/locales/i18n";

import type { Result } from "@/framework/types/api";
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

import { getFrameworkSettings } from "@/framework/config";

export type TokenProvider = () => string | null | undefined;
export type OnAuthError = (message: string) => void;

let _tokenProvider: TokenProvider = () => null;
let _onAuthError: OnAuthError = () => { };

const axiosInstance = axios.create({
	baseURL: "", // Will be set or used from settings
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

// Request interception
axiosInstance.interceptors.request.use(
	(config) => {
		const settings = getFrameworkSettings();
		if (!config.baseURL) config.baseURL = settings.baseApi;

		const accessToken = _tokenProvider();
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
axiosInstance.interceptors.response.use(
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
			_onAuthError(errMsg);
			return Promise.reject(new AuthException(errMsg));
		}

		if (!response) {
			return Promise.reject(new NetworkException(errMsg));
		}

		return Promise.reject(new ApiException(errMsg, status));
	},
);

class APIClient {
	setTokenProvider(provider: TokenProvider) {
		_tokenProvider = provider;
	}

	setOnAuthError(handler: OnAuthError) {
		_onAuthError = handler;
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
			axiosInstance
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
export default new APIClient();
