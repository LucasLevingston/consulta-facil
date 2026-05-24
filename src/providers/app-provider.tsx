"use client";

import { useEffect } from "react";

import { BottomNav } from "@/components/custom/bottom-nav";
import { Header } from "@/components/Header";
import { useUserStore } from "@/store/useUserStore";

export function AppProvider({ children }: { children: React.ReactNode }) {
	const { loadUser } = useUserStore();

	useEffect(() => {
		loadUser();
	}, [loadUser]);

	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1 bg-gradient-to-br from-background via-primary/5 to-background pb-20 md:pb-0">
				<div className="mx-auto w-full max-w-[1800px] p-4 md:p-6">
					{children}
				</div>
			</main>
			<BottomNav />
		</div>
	);
}
