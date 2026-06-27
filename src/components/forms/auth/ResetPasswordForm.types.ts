export interface ResetPasswordFormProps {
	onSubmit: (newPassword: string) => Promise<void>;
	isPending: boolean;
}
