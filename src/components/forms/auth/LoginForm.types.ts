import type { LoginInput } from "@/features/auth";

export interface LoginFormProps {
	onSubmit: (values: LoginInput) => Promise<void>;
	isPending: boolean;
}
