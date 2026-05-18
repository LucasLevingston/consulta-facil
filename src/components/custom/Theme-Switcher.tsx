"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const isDark = theme === "dark";

	return (
		<div className="flex items-center gap-2">
			<Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
			<Switch
				checked={isDark}
				onCheckedChange={(checked) => {
					setTheme(checked ? "dark" : "light");
				}}
				aria-label="Toggle theme"
			/>
			<Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
		</div>
	);
}
