"use client";

import { Building2, CreditCard, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface Props {
	displayName: string;
	initials: string;
	imageUrl: string | null | undefined;
	email: string | null | undefined;
	isProfessional: boolean;
	onLogout: () => void;
}

export function SidebarUserDropdown({
	displayName,
	initials,
	imageUrl,
	email,
	isProfessional,
	onLogout,
}: Props) {
	return (
		<DropdownMenuContent
			className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-border bg-card"
			side="bottom"
			align="end"
			sideOffset={4}
		>
			<DropdownMenuLabel className="p-0 font-normal">
				<div className="flex items-center gap-2 px-2 py-2">
					<Avatar className="h-8 w-8 rounded-lg border border-primary/30">
						<AvatarImage src={imageUrl ?? undefined} alt={displayName} />
						<AvatarFallback className="rounded-lg bg-primary/15 text-xs font-bold text-primary">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate text-xs font-medium">{displayName}</span>
						<span className="truncate text-xs text-muted-foreground">
							{email}
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
				{isProfessional && (
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
				onClick={onLogout}
				className="text-destructive focus:text-destructive"
			>
				<LogOut className="mr-2 h-4 w-4" />
				Sair da conta
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}
