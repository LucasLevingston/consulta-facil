"use client";

import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import type { ExamsSectionProps } from "./ExamsSection.types";
import { ExamsSectionContent } from "./ExamsSectionContent";

export function ExamsSection(props: ExamsSectionProps) {
	return (
		<SuspenseBoundary>
			<ExamsSectionContent {...props} />
		</SuspenseBoundary>
	);
}
