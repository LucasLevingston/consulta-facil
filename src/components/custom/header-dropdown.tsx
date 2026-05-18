"use client";

import { BadgeCheck, LogOut, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";

interface HeaderDropdownProps {
  user: {
    id: string;
    email: string;
    role: "USER" | "DOCTOR" | "ADMIN";
    imageUrl?: string | null;
  };
}

export function HeaderDropdown({ user }: HeaderDropdownProps) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const initials = user.email.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    document.cookie = "auth_token=; Max-Age=0; path=/";
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9 border border-primary/30">
          <AvatarImage
          src={user.imageUrl ?? undefined}
          alt="@shadcn"
          className="grayscale"
        />
            <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 border-border bg-card" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              {user.role === "ADMIN" ? "Administrador" : user.role === "DOCTOR" ? "Médico" : "Paciente"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

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
          {user.role === "ADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" />
                <span>Painel Admin</span>
              </Link>
            </DropdownMenuItem>
          )}
          {user.role === "DOCTOR" && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" />
                <span>Meu Perfil Médico</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair da conta</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
