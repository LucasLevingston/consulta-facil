"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";
import { useUserStore } from "@/store/useUserStore";
import { SETTINGS_LINKS } from "@/utils/constants/settings-links";

export function SettingsSidebar() {
	const pathname = usePathname();
	const { user } = useUserStore();
	const role = user?.role ?? "PATIENT";

	const links = SETTINGS_LINKS.filter(
		(link) => !link.roles || link.roles.includes(role),
	);

	return (
		<aside className="w-48 shrink-0">
			<nav className="flex flex-col gap-1">
				{links.map(({ href, label, icon: Icon }) => (
					<Link
						key={href}
						href={href}
						className={cn(
							"flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
							pathname === href || pathname.startsWith(`${href}/`)
								? "bg-primary/10 text-primary"
								: "text-muted-foreground hover:bg-muted hover:text-foreground",
						)}
					>
						<Icon className="h-4 w-4 shrink-0" />
						{label}
					</Link>
				))}
			</nav>
		</aside>
	);
}
