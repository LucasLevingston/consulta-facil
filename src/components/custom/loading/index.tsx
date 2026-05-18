import { cn } from "@/lib/utils";

const Loading = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				"h-4 w-4 animate-spin rounded-full border-blue-600 border-b-2",
				className,
			)}
		/>
	);
};

export { Loading };
