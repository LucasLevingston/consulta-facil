import { cn } from "@/lib/utils/cn";
import type { PageLayoutProps } from "./page-layout.types";

export function PageLayout({ children, className }: PageLayoutProps) {
	return <div className={cn("space-y-4", className)}>{children}</div>;
}
