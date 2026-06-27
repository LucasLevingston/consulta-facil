export interface ForgotPasswordFormProps {
	onSubmit: (email: string) => Promise<void>;
	isPending: boolean;
}
