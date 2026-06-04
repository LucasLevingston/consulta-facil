"use client";

import Cookies from "js-cookie";
import {
	Building2,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Settings,
	User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/useUserStore";
import {
	adminNav,
	defaultNav,
	doctorNav,
	patientNav,
	receptionistNav,
} from "./nav-items";

export default function AppSidebar() {
	const [mounted, setMounted] = React.useState(false);
	const { isAuthenticated, logout } = useAuthStore();
	const { user } = useUserStore();
	const pathname = usePathname();
	const router = useRouter();

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const isDoctor = user?.role === "PROFESSIONAL";
	const isAdmin = user?.role === "ADMIN";
	const isReceptionist = user?.role === "RECEPTIONIST";

	const roleNav = isAdmin
		? adminNav
		: isDoctor
			? doctorNav
			: isReceptionist
				? receptionistNav
				: patientNav;
	const navigation = [...defaultNav, ...roleNav];

	const initials = user?.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: (user?.email?.slice(0, 2).toUpperCase() ?? "CF");

	const displayName = user?.name ?? user?.email ?? "Usuário";

	const handleLogout = () => {
		logout();
		Cookies.remove("auth_token");
		router.push("/auth");
	};

	const isActive = (url: string) =>
		url === "/dashboard" ? pathname === url : pathname.startsWith(url);

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<Logo />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{navigation.map((group) => (
					<React.Fragment key={group.label}>
						<SidebarGroup>
							<SidebarGroupLabel>{group.label}</SidebarGroupLabel>

							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											tooltip={item.title}
											isActive={isActive(item.url)}
										>
											<Link href={item.url} className="flex items-center gap-2">
												<item.icon className="h-4 w-4" />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroup>

						<SidebarSeparator />
					</React.Fragment>
				))}
			</SidebarContent>

			<SidebarFooter>
				{isAuthenticated && user && (
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton
										size="lg"
										className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
									>
										<Avatar className="h-8 w-8 rounded-lg border border-primary/30">
											<AvatarImage
												src={user.imageUrl ?? undefined}
												alt={displayName}
											/>
											<AvatarFallback className="rounded-lg bg-primary/15 text-xs font-bold text-primary">
												{initials}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate text-xs font-medium text-foreground">
												{displayName}
											</span>
											<span className="truncate text-xs text-muted-foreground">
												{isAdmin
													? "Administrador"
													: isDoctor
														? "Profissional"
														: isReceptionist
															? "Recepcionista"
															: "Paciente"}
											</span>
										</div>
										<ChevronsUpDown className="ml-auto size-4" />
									</SidebarMenuButton>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-border bg-card"
									side="bottom"
									align="end"
									sideOffset={4}
								>
									<DropdownMenuLabel className="p-0 font-normal">
										<div className="flex items-center gap-2 px-2 py-2">
											<Avatar className="h-8 w-8 rounded-lg border border-primary/30">
												<AvatarImage
													src={user.imageUrl ?? undefined}
													alt={displayName}
												/>
												<AvatarFallback className="rounded-lg bg-primary/15 text-xs font-bold text-primary">
													{initials}
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate text-xs font-medium">
													{displayName}
												</span>
												<span className="truncate text-xs text-muted-foreground">
													{user.email}
												</span>
											</div>
										</div>
									</DropdownMenuLabel>

									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuItem asChild>
											<Link href="/dashboard/profile">
												<User className="mr-2 h-4 w-4" />
												Meu Perfil
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href="/settings">
												<Settings className="mr-2 h-4 w-4" />
												Configurações
											</Link>
										</DropdownMenuItem>
										<Separator />
										{isDoctor && (
											<>
												<DropdownMenuItem asChild>
													<Link href="/settings/billing">
														<CreditCard className="mr-2 h-4 w-4" />
														Assinatura Pro
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href="/settings/billing/clinic">
														<Building2 className="mr-2 h-4 w-4" />
														Plano Clínica
													</Link>
												</DropdownMenuItem>
											</>
										)}
									</DropdownMenuGroup>

									<DropdownMenuSeparator />

									<DropdownMenuItem
										onClick={handleLogout}
										className="text-destructive focus:text-destructive"
									>
										<LogOut className="mr-2 h-4 w-4" />
										Sair da conta
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				)}
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
