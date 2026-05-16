"use server";

import {
  LogOut,
  Settings,
  CalendarCheck,
  CalendarCheck2,
  User,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";

import LogoFull from "./logo/LogoFull";
import LogOutButton from "./LogOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import ThemeToggle from "./layout/ThemeToggle/theme-toggle";

export async function Header() {
  const session = await auth();

  return (
    <header className=" top-0 flex h-16 items-center gap-4 border-b bg-white px-4 dark:bg-dark-200 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-3 md:text-sm lg:gap-4">
        <LogoFull />
        <Link
          href="/"
          className="text-foreground hover:text-foreground transition-colors"
        >
          <Button variant="ghost" className="flex gap-2">
            Início
          </Button>
        </Link>
        {session?.user.role != "doctor" && (
          <Link
            href="/agendar-consulta"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Button variant="ghost" className="flex gap-2">
              Agendar consulta
            </Button>
          </Link>
        )}
        <Link
          href="/consultas"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Button variant="ghost" className="flex gap-2">
            Minhas consultas
          </Button>
        </Link>
        <Link
          href="/profissionais"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Button variant="ghost" className="flex gap-2">
            Profissionais
          </Button>
        </Link>
        <Link
          href="/clinicas"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Button variant="ghost" className="flex gap-2">
            Clinicas e organizações
          </Button>
        </Link>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="flex items-center">
            {/* <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            /> */}
          </div>
        </form>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                {session?.user.image && <AvatarImage src={session?.user?.image} />}
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>{" "}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex items-center justify-between gap-3">
              <div>
                <h1 className="font-bold text-base">Opções</h1>
                <p className="text-sm fornt-semibold">{session?.user.name}</p>
                <p className="text-xs font-normal">{session?.user.email}</p>
              </div>
              <span>{session?.user?.role === "doctor" ? <Stethoscope /> : <User />}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {session?.user ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/consultas" className="flex items-center">
                      <CalendarCheck className="mr-2 size-4" />
                      <span>Ver minhas consultas</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/agendar-consulta" className="flex items-center">
                      <CalendarCheck2 className="mr-2 size-4" />
                      <span>Agendar consulta</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 size-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <LogOutButton />
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/auth" className="flex items-center">
                  <LogOut className="mr-2 size-4" />
                  <span>Logar ou criar conta</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
