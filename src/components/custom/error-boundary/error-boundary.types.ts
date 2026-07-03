import type { ReactNode } from "react";

export interface ErrorBoundaryFallbackProps {
	error: Error;
	reset: () => void;
}

export interface ErrorBoundaryProps {
	children: ReactNode;
	onReset?: () => void;
	fallbackRender?: (props: ErrorBoundaryFallbackProps) => ReactNode;
}

export interface ErrorBoundaryState {
	error: Error | null;
}
