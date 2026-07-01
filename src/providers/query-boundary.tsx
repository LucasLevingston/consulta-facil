import { cn } from "@/lib/utils/cn";
import { LoadingPage } from "../components/custom/loading/loading-page";
import { PageLayout } from "../components/custom/page-layout";
import type { QueryBoundaryProps } from "./query-boundary.types";

export function QueryBoundary({
	isLoading,
	error,
	children,
	className,
}: QueryBoundaryProps) {
	if (isLoading) {
		return <LoadingPage />;
	}

	if (error) {
		return (
			<div
				className={cn(
					className,
					"flex flex-col items-center justify-center p-6 text-destructive",
				)}
			>
				Erro ao carregar dados
			</div>
		);
	}

	return <PageLayout className={cn(className, "")}>{children}</PageLayout>;
}
