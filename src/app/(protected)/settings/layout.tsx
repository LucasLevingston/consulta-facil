import type { PropsWithChildren } from "react";

import { SettingsSidebar } from "./_components/settings-sidebar";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen w-full flex-col">
			<main>
				<div className="mx-auto grid w-full  items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
					<nav
						className="text-muted-foreground grid gap-4 text-sm"
						x-chunk="dashboard-04-chunk-0"
					>
						<SettingsSidebar />
					</nav>
					<div className="grid gap-6">
						<div>{children}</div>
					</div>
				</div>
			</main>
		</div>
	);
}
