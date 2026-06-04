"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface CustomPaginationProps {
	/** Current page, 0-indexed */
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
	/** Show "Página X de Y" label. Default: true */
	showInfo?: boolean;
}

export function getPageNumbers(
	current: number,
	total: number,
): (number | "...")[] {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i);

	const pages: (number | "...")[] = [0];
	const start = Math.max(1, current - 2);
	const end = Math.min(total - 2, current + 2);

	// Left gap: pages between 0 and start
	const leftGap = start - 1;
	if (leftGap === 1)
		pages.push(1); // single page: show it
	else if (leftGap > 1) pages.push("..."); // multiple pages: ellipsis

	for (let i = start; i <= end; i++) pages.push(i);

	// Right gap: pages between end and total-1
	const rightGap = total - 1 - end - 1;
	if (rightGap === 1)
		pages.push(end + 1); // single page: show it
	else if (rightGap > 1) pages.push("..."); // multiple pages: ellipsis

	pages.push(total - 1);

	return pages;
}

export function CustomPagination({
	currentPage,
	totalPages,
	onPageChange,
	className,
	showInfo = true,
}: CustomPaginationProps) {
	if (totalPages <= 1) return null;

	const pages = getPageNumbers(currentPage, totalPages);

	return (
		<div className={cn("flex flex-col items-center gap-2.5", className)}>
			{showInfo && (
				<p className="text-sm text-muted-foreground">
					Página{" "}
					<span className="font-medium text-foreground">{currentPage + 1}</span>{" "}
					de <span className="font-medium text-foreground">{totalPages}</span>
				</p>
			)}

			<nav aria-label="Paginação" className="flex items-center gap-1">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 0}
					className="h-9 gap-1.5 px-3 rounded-xl"
					aria-label="Página anterior"
				>
					<ChevronLeft className="h-4 w-4" />
					<span className="hidden sm:inline">Anterior</span>
				</Button>

				<div className="flex items-center gap-1">
					{(() => {
						let ellipsisIdx = 0;
						return pages.map((p) =>
							p === "..." ? (
								<span
									key={`ellipsis-${ellipsisIdx++}`}
									className="flex h-9 w-9 items-center justify-center text-muted-foreground"
									aria-hidden
								>
									<MoreHorizontal className="h-4 w-4" />
								</span>
							) : (
								<Button
									key={p}
									variant={p === currentPage ? "default" : "outline"}
									size="sm"
									onClick={() => onPageChange(p)}
									className="h-9 w-9 p-0 rounded-xl"
									aria-label={`Ir para página ${p + 1}`}
									aria-current={p === currentPage ? "page" : undefined}
								>
									{p + 1}
								</Button>
							),
						);
					})()}
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages - 1}
					className="h-9 gap-1.5 px-3 rounded-xl"
					aria-label="Próxima página"
				>
					<span className="hidden sm:inline">Próximo</span>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</nav>
		</div>
	);
}
