import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "@/config/api";

/**
 * Custom Orval mutator — usa a instância axios do projeto que já tem
 * o interceptor de Authorization (JWT) e o redirect 401.
 */
export const customInstance = <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  return api.request<T>(config).then((r) => r.data);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
