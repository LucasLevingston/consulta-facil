"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/custom/error-boundary/error-boundary";
import { LoadingPage } from "@/components/custom/loading/loading-page";
import { PageLayout } from "@/components/custom/page-layout";
import { cn } from "@/lib/utils/cn";
import type { SuspenseBoundaryProps } from "./suspense-boundary.types";

export function SuspenseBoundary({
	children,
	className,
}: SuspenseBoundaryProps) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary onReset={reset}>
					<Suspense fallback={<LoadingPage />}>
						<PageLayout className={cn(className)}>{children}</PageLayout>
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
