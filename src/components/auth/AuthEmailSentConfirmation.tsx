interface Props {
	description: React.ReactNode;
	onRetry: () => void;
}

export default function AuthEmailSentConfirmation({
	description,
	onRetry,
}: Props) {
	return (
		<div className="text-center space-y-6">
			<div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
				<svg
					className="w-8 h-8 text-primary"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
					/>
				</svg>
			</div>
			<div className="space-y-2">
				<h2 className="text-2xl font-bold text-foreground">
					Verifique seu e-mail
				</h2>
				<p className="text-sm text-muted-foreground leading-relaxed">
					{description}
				</p>
			</div>
			<p className="text-xs text-muted-foreground">
				Não recebeu?{" "}
				<button
					type="button"
					onClick={onRetry}
					className="text-primary hover:underline cursor-pointer"
				>
					Tentar novamente
				</button>
			</p>
		</div>
	);
}
