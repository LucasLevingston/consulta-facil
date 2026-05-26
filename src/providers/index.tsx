import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/providers/app-provider";
import { MonitoringProvider } from "@/providers/monitoring-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<MonitoringProvider>
			<div className="text-zinc-600 dark:text-white">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<QueryProvider>
						<ToastProvider />
						<TooltipProvider>
							<AppProvider>{children}</AppProvider>
						</TooltipProvider>
					</QueryProvider>
				</ThemeProvider>
			</div>
		</MonitoringProvider>
	);
};

export default Providers;
