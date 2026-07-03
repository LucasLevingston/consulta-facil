import { forgotPasswordApi } from "@/lib/api/auth/forgot-password.api";
import { googleLoginApi } from "@/lib/api/auth/google-login.api";
import { loginApi } from "@/lib/api/auth/login.api";
import { magicLinkRequestApi } from "@/lib/api/auth/magic-link-request.api";
import { magicLinkVerifyApi } from "@/lib/api/auth/magic-link-verify.api";
import { registerApi } from "@/lib/api/auth/register.api";
import { resetPasswordApi } from "@/lib/api/auth/reset-password.api";
import type { LoginInput } from "@/lib/schemas/auth/login.schema";
import type { LoginResponse } from "@/lib/schemas/auth/login-response.schema";
import type { RegisterInput } from "@/lib/schemas/auth/register.schema";
import type { UserResponse } from "@/lib/schemas/auth/user-response.schema";

export const authRepository = {
	login: async (data: LoginInput): Promise<LoginResponse> => loginApi(data),

	googleLogin: async (idToken: string): Promise<LoginResponse> =>
		googleLoginApi(idToken),

	register: async (data: RegisterInput): Promise<UserResponse> =>
		registerApi(data),

	forgotPassword: async (email: string): Promise<void> =>
		forgotPasswordApi(email),

	resetPassword: async (token: string, newPassword: string): Promise<void> =>
		resetPasswordApi(token, newPassword),

	magicLinkRequest: async (email: string): Promise<void> =>
		magicLinkRequestApi(email),

	magicLinkVerify: async (token: string): Promise<LoginResponse> =>
		magicLinkVerifyApi(token),
};
