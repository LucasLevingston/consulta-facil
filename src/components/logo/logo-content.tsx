import type React from "react";
import { cn } from "@/lib/utils/cn";

export const LogoContent = (props: React.ComponentProps<"p">) => {
	return (
		<p
			{...props}
			className={cn(
				"bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-2xl",
				props.className,
			)}
		>
			Consulta Fácil
		</p>
	);
};
