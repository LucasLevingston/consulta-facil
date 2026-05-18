"use client";

import Cookies from "js-cookie";
import {
  BadgeCheck,
  Bell,
  CalendarDays,
  ChevronsUpDown,
  CreditCard,
  Home,
  LogOut,
  Settings,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/useUserStore";

const patientNav = [
	{ title: "Início", url: "/dashboard", icon: Home },
	{
		title: "Minhas Consultas",
		url: "/dashboard/appointments",
		icon: CalendarDays,
	},
	{
		title: "Agendar Consulta",
		url: "/dashboard/appointments/create",
		icon: Stethoscope,
	},
	{
		title: "Profissionais",
		url: "/professionals",
		icon: Stethoscope,
	},
	{ title: "Configurações", url: "/settings", icon: Settings },
];

const adminNav = [
	{ title: "Início", url: "/", icon: Home },
	{ title: "Consultas", url: "/dashboard/appointments", icon: CalendarDays },
	{ title: "Painel Admin", url: "/admin", icon: BadgeCheck },
	{ title: "Configurações", url: "/settings", icon: Settings },
];

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

	const navItems = user?.role === "ADMIN" ? adminNav : patientNav;
	const initials = user?.email?.slice(0, 2).toUpperCase() ?? "CF";

	const handleLogout = () => {
		logout();
		Cookies.remove("auth_token");
		router.push("/auth");
	};

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
				<SidebarGroup>
					<SidebarGroupLabel>Navegação</SidebarGroupLabel>
					<SidebarMenu>
						{navItems.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									isActive={pathname === item.url}
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
											<AvatarFallback className="rounded-lg bg-primary/15 text-xs font-bold text-primary">
												{initials}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate text-xs text-muted-foreground">
												{user.email}
											</span>
											<span className="truncate text-xs text-primary">
												{user.role === "ADMIN" ? "Médico" : "Paciente"}
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
												<AvatarFallback className="rounded-lg bg-primary/15 text-xs font-bold text-primary">
													{initials}
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate text-xs">{user.email}</span>
												<span className="truncate text-xs text-primary">
													{user.role === "ADMIN"
														? "Médico / Admin"
														: "Paciente"}
												</span>
											</div>
										</div>
									</DropdownMenuLabel>

									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuItem asChild>
											<Link href="/settings">
												<BadgeCheck className="mr-2 h-4 w-4" />
												Conta
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href="/settings/billing">
												<CreditCard className="mr-2 h-4 w-4" />
												Assinatura
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Bell className="mr-2 h-4 w-4" />
											Notificações
										</DropdownMenuItem>
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
