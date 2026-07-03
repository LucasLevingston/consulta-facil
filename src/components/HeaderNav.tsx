"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "./Header.nav";

interface Props {
	items: NavItem[];
	isActive: (url: string) => boolean;
}

export function HeaderNav({ items, isActive }: Props) {
	return (
		<nav className="hidden items-center gap-0.5 md:flex">
			{items.map((item) => {
				const active = isActive(item.url);
				return (
					<Link
						key={item.url}
						href={item.url}
						className={cn(
							"flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
							active
								? "bg-primary/10 text-primary"
								: "text-muted-foreground hover:bg-muted hover:text-foreground",
						)}
					>
						<item.icon className="h-4 w-4 shrink-0" />
						{item.title}
					</Link>
				);
			})}
		</nav>
	);
}
