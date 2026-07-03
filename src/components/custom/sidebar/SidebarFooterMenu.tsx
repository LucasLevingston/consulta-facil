"use client";

import { ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarUserDropdown } from "./SidebarUserDropdown";

interface Props {
	displayName: string;
	initials: string;
	imageUrl: string | null | undefined;
	email: string | null | undefined;
	isAdmin: boolean;
	isProfessional: boolean;
	isReceptionist: boolean;
	onLogout: () => void;
}

export function SidebarFooterMenu({
	displayName,
	initials,
	imageUrl,
	email,
	isAdmin,
	isProfessional,
	isReceptionist,
	onLogout,
}: Props) {
	const roleLabel = isAdmin
		? "Administrador"
		: isProfessional
			? "Profissional"
			: isReceptionist
				? "Recepcionista"
				: "Paciente";

	return (
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg border border-primary/30">
									<AvatarImage src={imageUrl ?? undefined} alt={displayName} />
									<AvatarFallback className="rounded-lg bg-primary/15 text-xs font-bold text-primary">
										{initials}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate text-xs font-medium text-foreground">
										{displayName}
									</span>
									<span className="truncate text-xs text-muted-foreground">
										{roleLabel}
									</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<SidebarUserDropdown
							displayName={displayName}
							initials={initials}
							imageUrl={imageUrl}
							email={email}
							isProfessional={isProfessional}
							onLogout={onLogout}
						/>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	);
}
