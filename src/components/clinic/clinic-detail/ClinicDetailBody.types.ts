const TABS = ["overview", "members", "appointments", "financial"] as const;
export type ClinicTab = (typeof TABS)[number];

export interface ClinicDetailBodyProps {
	clinicId: string;
	activeTab: ClinicTab;
	setTab: (tab: ClinicTab) => void;
}
