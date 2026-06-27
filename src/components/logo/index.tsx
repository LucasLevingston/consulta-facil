import Link from "next/link";
import type { LogoProps } from "./Logo.types";
import { LogoContent } from "./logo-content";
import { LogoIcon } from "./logo-icon";

export const Logo = (props: LogoProps) => {
	return (
		<Link href="/" className="flex items-center gap-2">
			<LogoIcon {...props} />
			<LogoContent {...props} />
		</Link>
	);
};
