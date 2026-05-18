"use client";

import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

import { authApi } from "@/lib/api/auth.api";
import type { LoginInput, RegisterInput } from "@/lib/schemas/auth.schema";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/useUserStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.token);
      Cookies.set("auth_token", data.token, { expires: (data.expiresIn ?? 86400) / 86400 });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const clearUser = useUserStore((s) => s.clearUser);

  return () => {
    logout();
    clearUser();
    Cookies.remove("auth_token");
  };
}
