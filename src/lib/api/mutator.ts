import type { AxiosError, AxiosRequestConfig } from "axios";
import { api } from "@/config/api";

export const customInstance = <T>(
	config: AxiosRequestConfig,
	options?: { signal?: AbortSignal },
): Promise<T> => {
	return api
		.request<T>({ ...config, signal: options?.signal })
		.then((r) => r.data);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
