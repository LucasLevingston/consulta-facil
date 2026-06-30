export { useForgotPassword } from "@/hooks/api/auth/use-forgot-password";
export { useGoogleLogin } from "@/hooks/api/auth/use-google-login";
export { useLogin } from "@/hooks/api/auth/use-login";
export { useLogout } from "@/hooks/api/auth/use-logout";
export { useMagicLinkRequest } from "@/hooks/api/auth/use-magic-link-request";
export { useMagicLinkVerify } from "@/hooks/api/auth/use-magic-link-verify";
export { useRegister } from "@/hooks/api/auth/use-register";
export { useResetPassword } from "@/hooks/api/auth/use-reset-password";
export type { PermissionKey } from "@/lib/permission-key";
export {
	type EmailInput,
	emailSchema,
} from "@/lib/schemas/auth/email.schema";
export {
	type LoginInput,
	loginSchema,
} from "@/lib/schemas/auth/login.schema";
export {
	type RegisterInput,
	registerSchema,
} from "@/lib/schemas/auth/register.schema";
export {
	type ResetPasswordInput,
	resetPasswordSchema,
} from "@/lib/schemas/auth/reset-password.schema";
export type { UserResponse } from "@/lib/schemas/auth/user-response.schema";
export { useAuthStore } from "@/store/auth.store";
export { useUserStore } from "@/store/useUserStore";
