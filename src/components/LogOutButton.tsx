"use client";
import { LogOut } from "lucide-react";
import React from "react";

import { SignOut } from "@/lib/actions/user.actions";

import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function LogOutButton() {
  const handleLogOut = async () => {
    await SignOut();
  };
  return (
    <DropdownMenuItem onClick={handleLogOut} asChild>
      <div className="flex items-center">
        <LogOut className="mr-2 size-4" />
        Sair da conta
      </div>
    </DropdownMenuItem>
  );
}
