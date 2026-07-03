import type { RegisterInput } from "@/features/auth";

export interface RegisterFormProps {
	onSubmit: (data: RegisterInput) => Promise<void>;
	isPending: boolean;
}
