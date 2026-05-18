"use client";

import { Bell, CalendarPlus, Menu, Search } from "lucide-react";
import Link from "next/link";

import { useUserStore } from "@/store/useUserStore";
import { CustomButton } from "./custom/custom-button";
import { CustomInput } from "./custom/custom-input";
import { HeaderDropdown } from "./custom/header-dropdown";
import { ThemeSwitcher } from "./custom/Theme-Switcher";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";
import { SidebarTrigger } from "./ui/sidebar";

export function Header() {
	const { user } = useUserStore();

	return (
		<header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-3 py-3 backdrop-blur-xl sm:px-6">
			{/* Left */}
			<div className="flex items-center gap-2">
				{user && <SidebarTrigger />}
				{user && (
					<Separator orientation="vertical" className="hidden h-6 sm:block" />
				)}
				<Logo />
			</div>

			{/* Desktop right */}
			<div className="hidden items-center gap-3 lg:flex">
				<ThemeSwitcher />

				{user ? (
					<>
						<Link href="/agendar-consulta">
							<CustomButton
							>
								<CalendarPlus className="mr-2 h-4 w-4" />
								Agendar
							</CustomButton>
						</Link>

						<Button
							size="icon"
							className="h-10 w-10 rounded-2xl border border-border bg-background/60 text-foreground backdrop-blur hover:bg-primary/10 hover:text-primary"
						>
							<Bell className="h-4 w-4" />
						</Button>

						<HeaderDropdown user={user} />
					</>
				) : (
					<div className="flex items-center gap-2">
						<Link href="/auth/register">
										<CustomButton>
											Criar conta
										</CustomButton>
									</Link>
									<Link href="/auth/login">
										<CustomButton>
											Entrar
										</CustomButton>
									</Link>
					</div>
				)}
			</div>

			{/* Mobile right */}
			<div className="flex items-center gap-2 lg:hidden">
				<ThemeSwitcher />

				<Sheet>
					<SheetTrigger asChild>
						<Button
							size="icon"
							className="h-10 w-10 rounded-2xl border border-border bg-background/60 text-foreground backdrop-blur hover:bg-primary/10 hover:text-primary"
						>
							<Menu className="h-5 w-5" />
						</Button>
					</SheetTrigger>

					<SheetContent
						side="right"
						className="w-[300px] border-l border-border bg-background/95 backdrop-blur-xl"
					>
						<SheetHeader>
							<SheetTitle>
								<Logo />
							</SheetTitle>
						</SheetHeader>

						<div className="mt-8 space-y-4">
							<CustomInput
								type="text"
								placeholder="Buscar médicos..."
								icon={Search}
							/>

							{user ? (
								<div className="space-y-3">
									<Link href="/agendar-consulta" className="block">
										<Button className="h-11 w-full justify-start rounded-2xl bg-primary text-background">
											<CalendarPlus className="mr-2 h-4 w-4" />
											Agendar Consulta
										</Button>
									</Link>
									<Button
										variant="outline"
										className="h-11 w-full justify-start rounded-2xl"
									>
										<Bell className="mr-2 h-4 w-4" />
										Notificações
									</Button>
									<div className="pt-2">
										<HeaderDropdown user={user} />
									</div>
								</div>
							) : (
								<div className="flex flex-col gap-3">
									<Link href="/auth/register">
										<Button className="h-11 w-full rounded-2xl bg-primary text-background">
											Criar conta
										</Button>
									</Link>
									<Link href="/auth/login">
										<Button className="h-11 w-full rounded-2xl bg-primary text-background">
											Entrar
										</Button>
									</Link>
								</div>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
