import type { AxiosError } from "axios";

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
