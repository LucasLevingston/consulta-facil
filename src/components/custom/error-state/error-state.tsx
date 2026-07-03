import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { ErrorStateProps } from "./error-state.types";

export function ErrorState({
	message = "Erro ao carregar dados",
	onRetry,
	className,
}: ErrorStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-4 p-6 text-center text-destructive",
				className,
			)}
		>
			<p>{message}</p>
			{onRetry && (
				<Button variant="outline" size="sm" onClick={onRetry}>
					Tentar novamente
				</Button>
			)}
		</div>
	);
}
