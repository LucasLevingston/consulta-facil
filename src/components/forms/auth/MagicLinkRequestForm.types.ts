export interface MagicLinkRequestFormProps {
	onSubmit: (email: string) => Promise<void>;
	isPending: boolean;
}
