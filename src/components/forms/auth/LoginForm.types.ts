import type { LoginInput } from "@/lib/schemas/auth/login.schema";

export interface LoginFormProps {
	onSubmit: (values: LoginInput) => Promise<void>;
	isPending: boolean;
}
