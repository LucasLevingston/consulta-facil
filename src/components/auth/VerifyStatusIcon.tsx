interface Props {
	isLoading: boolean;
	isSuccess: boolean;
}

export function VerifyStatusIcon({ isLoading, isSuccess }: Props) {
	if (isLoading) {
		return (
			<svg
				className="w-7 h-7 text-primary animate-spin"
				fill="none"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
				/>
			</svg>
		);
	}
	if (isSuccess) {
		return (
			<svg
				className="w-7 h-7 text-green-500"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M4.5 12.75l6 6 9-13.5"
				/>
			</svg>
		);
	}
	return (
		<svg
			className="w-7 h-7 text-destructive"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M6 18 18 6M6 6l12 12"
			/>
		</svg>
	);
}
