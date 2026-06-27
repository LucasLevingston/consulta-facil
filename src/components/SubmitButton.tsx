import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { SubmitButtonProps } from "./SubmitButton.types";
import { Button } from "./ui/button";

const SubmitButton = ({
	isLoading,
	className,
	children,
}: SubmitButtonProps) => {
	return (
		<Button
			type="submit"
			disabled={isLoading}
			className={cn(
				"h-12 w-full rounded-xl bg-primary font-semibold text-background hover:bg-primary/90 transition-all",
				className,
			)}
		>
			{isLoading ? (
				<span className="flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin" />
					Carregando...
				</span>
			) : (
				children
			)}
		</Button>
	);
};

export default SubmitButton;
