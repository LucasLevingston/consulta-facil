import { BellRing, Sparkles } from "lucide-react";
import type { PageHeaderProps } from "./page-header.types";

const PageHeader = ({
	title,
	description,
	count,
	countLabel = "canal",
	icon,
}: PageHeaderProps) => {
	return (
		<div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-5 sm:p-6 lg:p-8">
			<div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-40 sm:w-40" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-secondary/10 blur-3xl sm:h-32 sm:w-32" />
			<div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start gap-3 sm:items-center">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary sm:h-12 sm:w-12">
						{icon || <BellRing className="h-5 w-5 sm:h-6 sm:w-6" />}
					</div>
					<div className="min-w-0">
						<h1 className="break-words text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
							{title}
						</h1>
						<p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
							{description}
						</p>
					</div>
				</div>
				{typeof count === "number" && (
					<div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-xl">
						<Sparkles className="h-4 w-4" />
						{count} {countLabel}
						{count !== 1 ? "s" : ""}
					</div>
				)}
			</div>
		</div>
	);
};

export default PageHeader;
