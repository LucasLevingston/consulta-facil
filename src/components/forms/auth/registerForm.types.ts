import type { RegisterInput } from "@/lib/schemas/auth/register.schema";

export interface RegisterFormProps {
	onSubmit: (data: RegisterInput) => Promise<void>;
	isPending: boolean;
}
