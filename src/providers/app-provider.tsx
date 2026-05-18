"use client";

import { useEffect } from "react";

import AppSidebar from "@/components/custom/sidebar/app-sidebar";
import { Header } from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUserStore } from "@/store/useUserStore";

export function AppProvider({ children }: { children: React.ReactNode }) {
	const { user, loadUser } = useUserStore();

	useEffect(() => {
		loadUser();
	}, [loadUser]);

	return (
		<SidebarProvider>
			{user && <AppSidebar />}
			
			<SidebarInset>
				<div className="flex min-h-screen flex-col">
					<Header />
					<main className="flex-1 bg-gradient-to-br from-background via-primary/5 to-background">
						<div className="mx-auto w-full max-w-[1800px] p-4 md:p-6">
							{children}
						</div>
					</main>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
