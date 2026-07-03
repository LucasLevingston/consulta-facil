export interface ScheduleGlobalSettingsProps {
	defaultDuration: number;
	defaultBreak: number;
	onApply: (duration: number, breakTime: number) => void;
}
