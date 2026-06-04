import Link from "next/link";
import type React from "react";
import { LogoContent } from "./logo-content";
import { LogoIcon } from "./logo-icon";

type logoProps = React.ComponentProps<"p">;

export const Logo = (props: logoProps) => {
	return (
		<Link href="/" className="flex items-center gap-2">
			<LogoIcon {...props} />
			<LogoContent {...props} />
		</Link>
	);
};
