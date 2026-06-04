import { cn } from "@/lib/utils/cn";

interface PageLayoutProps {
	children: React.ReactNode;
	className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
	return <div className={cn("space-y-4", className)}>{children}</div>;
}
