import type { ReactNode } from "react";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex">
			<AuthLeftPanel />
			<div className="flex-1 flex flex-col overflow-y-auto">{children}</div>
		</div>
	);
}
