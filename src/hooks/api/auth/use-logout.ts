"use client";

import Cookies from "js-cookie";

import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/useUserStore";

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const clearUser = useUserStore((s) => s.clearUser);

  return () => {
    logout();
    clearUser();
    Cookies.remove("auth_token");
  };
}
