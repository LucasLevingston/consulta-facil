"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/settings", label: "Meu perfil" },
  { href: "/settings/theme", label: "Tema" },
  { href: "/settings/billing", label: "Assinatura" },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0">
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
