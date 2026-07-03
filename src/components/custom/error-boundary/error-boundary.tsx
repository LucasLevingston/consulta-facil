import { Component } from "react";
import { ErrorState } from "@/components/custom/error-state/error-state";
import type {
	ErrorBoundaryProps,
	ErrorBoundaryState,
} from "./error-boundary.types";

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	reset = () => {
		this.setState({ error: null });
		this.props.onReset?.();
	};

	render() {
		const { error } = this.state;

		if (error) {
			const { fallbackRender } = this.props;
			if (fallbackRender) {
				return fallbackRender({ error, reset: this.reset });
			}
			return <ErrorState onRetry={this.reset} />;
		}

		return this.props.children;
	}
}
