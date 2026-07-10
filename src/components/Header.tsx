"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/features/auth";
import { CustomButton } from "./custom/custom-button";
import { HeaderDropdown } from "./custom/header-dropdown";
import { NotificationBell } from "./custom/notifications/NotificationBell";
import { ThemeSwitcher } from "./custom/theme-switcher";
import { navByRole } from "./Header.nav";
import { HeaderNav } from "./HeaderNav";
import { Logo } from "./logo";

export function Header() {
	const { user } = useUserStore();
	const pathname = usePathname();

	const items = user
		? [...navByRole.DEFAULT, ...(navByRole[user.role] ?? navByRole.PATIENT)]
		: [];

	const isActive = (url: string) =>
		url === "/dashboard" ? pathname === url : pathname === url;

	return (
		<header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-3 py-3 backdrop-blur-xl sm:px-6">
			<div className="flex min-w-0 items-center gap-4">
				<Logo />
				{user && <HeaderNav items={items} isActive={isActive} />}
			</div>
			<div className="flex shrink-0 items-center gap-2">
				<ThemeSwitcher />
				{user ? (
					<>
						<NotificationBell />
						<HeaderDropdown user={user} />
					</>
				) : (
					<div className="flex items-center gap-2">
						<Link href="/auth/register" className="hidden sm:block">
							<CustomButton variant="outline">Criar conta</CustomButton>
						</Link>
						<Link href="/auth/login">
							<CustomButton>Entrar</CustomButton>
						</Link>
					</div>
				)}
			</div>
		</header>
	);
}
