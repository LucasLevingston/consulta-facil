import {
	BadgeCheck,
	Building2,
	Clock,
	Settings,
	User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import {
	DropdownMenuGroup,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Props {
	role: string;
}

export function HeaderDropdownLinks({ role }: Props) {
	return (
		<DropdownMenuGroup>
			<DropdownMenuItem asChild>
				<Link href="/settings" className="flex items-center gap-2">
					<UserIcon className="h-4 w-4" />
					<span>Perfil</span>
				</Link>
			</DropdownMenuItem>
			<DropdownMenuItem asChild>
				<Link href="/settings" className="flex items-center gap-2">
					<Settings className="h-4 w-4" />
					<span>Configurações</span>
				</Link>
			</DropdownMenuItem>
			{role === "ADMIN" && (
				<DropdownMenuItem asChild>
					<Link href="/admin" className="flex items-center gap-2">
						<BadgeCheck className="h-4 w-4" />
						<span>Painel Admin</span>
					</Link>
				</DropdownMenuItem>
			)}
			{role === "PROFESSIONAL" && (
				<>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/profile" className="flex items-center gap-2">
							<BadgeCheck className="h-4 w-4" />
							<span>Meu Perfil Profissional</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/settings/schedule" className="flex items-center gap-2">
							<Clock className="h-4 w-4" />
							<span>Horários de Atendimento</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link
							href="/settings/my-clinic"
							className="flex items-center gap-2"
						>
							<Building2 className="h-4 w-4" />
							<span>Minha Clínica</span>
						</Link>
					</DropdownMenuItem>
				</>
			)}
		</DropdownMenuGroup>
	);
}
