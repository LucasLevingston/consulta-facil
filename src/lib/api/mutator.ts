import type { AxiosRequestConfig } from "axios";
import { api } from "@/config/api";

export const customInstance = <T>(
	config: AxiosRequestConfig,
	options?: { signal?: AbortSignal },
): Promise<T> => {
	return api
		.request<T>({ ...config, signal: options?.signal })
		.then((r) => r.data);
};

export type { BodyType, ErrorType } from "./mutator.types";
