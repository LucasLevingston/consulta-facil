export function ResetPasswordMobileLogo() {
	return (
		<div className="lg:hidden flex items-center gap-2 mb-10">
			<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
				<svg
					className="w-4 h-4 text-primary-foreground"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M4.5 12.75l6 6 9-13.5"
					/>
				</svg>
			</div>
			<span className="font-bold text-lg text-foreground">Consulta Fácil</span>
		</div>
	);
}
