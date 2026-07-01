"use client";

import Link from "next/link";
import * as React from "react";
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import type { getNavGroupsForRole } from "@/lib/nav/nav-registry";

interface Props {
	navigation: ReturnType<typeof getNavGroupsForRole>;
	isActive: (url: string) => boolean;
}

export function SidebarNavContent({ navigation, isActive }: Props) {
	return (
		<SidebarContent>
			{navigation.map((group) => (
				<React.Fragment key={group.label}>
					<SidebarGroup>
						<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						<SidebarMenu>
							{group.items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										tooltip={item.title}
										isActive={isActive(item.url)}
									>
										<Link href={item.url} className="flex items-center gap-2">
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
					<SidebarSeparator />
				</React.Fragment>
			))}
		</SidebarContent>
	);
}
