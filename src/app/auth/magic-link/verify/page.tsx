import { Suspense } from "react";

import VerifyContent from "@/components/auth/VerifyContent";

export default function MagicLinkVerifyPage() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-1 items-center justify-center">
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
				</div>
			}
		>
			<VerifyContent />
		</Suspense>
	);
}
