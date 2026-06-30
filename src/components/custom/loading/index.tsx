import { cn } from "@/lib/utils/cn";
import type { LoadingProps } from "./loading.types";

const Loading = ({ className }: LoadingProps) => {
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
