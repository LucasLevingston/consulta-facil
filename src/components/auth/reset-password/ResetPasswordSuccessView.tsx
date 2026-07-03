interface Props {
	onGoToLogin: () => void;
}

export function ResetPasswordSuccessView({ onGoToLogin }: Props) {
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
						d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			</div>
			<div className="space-y-2">
				<h2 className="text-2xl font-bold text-foreground">
					Senha redefinida!
				</h2>
				<p className="text-sm text-muted-foreground">
					Sua senha foi alterada com sucesso.
				</p>
			</div>
			<button
				type="button"
				onClick={onGoToLogin}
				className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
			>
				Ir para o login
			</button>
		</div>
	);
}
