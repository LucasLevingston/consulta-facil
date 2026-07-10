"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { ClinicDetailBody } from "./ClinicDetailBody";
import type { ClinicTab } from "./ClinicDetailBody.types";

const TABS = ["overview", "members", "appointments", "financial"] as const;

export function ClinicDetailContent() {
	const params = useParams();
	const clinicId = params.id as string;
	const router = useRouter();
	const searchParams = useSearchParams();

	function isValidTab(v: string | null): v is ClinicTab {
		return TABS.includes(v as ClinicTab);
	}

	const activeTab: ClinicTab = isValidTab(searchParams.get("tab"))
		? (searchParams.get("tab") as ClinicTab)
		: "overview";

	function setTab(tab: ClinicTab) {
		const p = new URLSearchParams(searchParams.toString());
		p.set("tab", tab);
		router.replace(`?${p.toString()}`, { scroll: false });
	}

	return (
		<SuspenseBoundary>
			<ClinicDetailBody
				clinicId={clinicId}
				activeTab={activeTab}
				setTab={setTab}
			/>
		</SuspenseBoundary>
	);
}
