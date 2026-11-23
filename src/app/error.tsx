"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/custom/error-state/error-state";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<ErrorState
				message="Ocorreu um erro inesperado. Tente novamente."
				onRetry={reset}
			/>
		</div>
	);
}
