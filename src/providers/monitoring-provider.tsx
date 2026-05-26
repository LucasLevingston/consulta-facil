"use client";

import { useEffect } from "react";
import { initFaro } from "@/lib/monitoring/faro";

export function MonitoringProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		initFaro();
	}, []);

	return <>{children}</>;
}
