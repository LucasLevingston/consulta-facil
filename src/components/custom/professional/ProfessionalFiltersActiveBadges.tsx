"use client";

import { MapPin, Search, Stethoscope, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DAYS } from "@/utils/constants/days-of-week";
import { ALL } from "@/utils/constants/filter-sentinels";
import type { useProfessionalFilters } from "./useProfessionalFilters";

interface Props {
	filters: ReturnType<typeof useProfessionalFilters>;
}

export function ProfessionalFiltersActiveBadges({ filters }: Props) {
	return (
		<div className="flex flex-wrap gap-2">
			{filters.name && (
				<FilterBadge
					icon={<Search className="h-3 w-3" />}
					onRemove={() => filters.setName("")}
				>
					&ldquo;{filters.name}&rdquo;
				</FilterBadge>
			)}
			{filters.profession && (
				<FilterBadge onRemove={() => filters.handleProfessionChange(ALL)}>
					{filters.profession}
				</FilterBadge>
			)}
			{filters.specialty && (
				<FilterBadge onRemove={() => filters.setSpecialty("")}>
					{filters.specialty}
				</FilterBadge>
			)}
			{filters.serviceTitle && (
				<FilterBadge
					icon={<Stethoscope className="h-3 w-3" />}
					onRemove={() => filters.setServiceTitle("")}
				>
					{filters.serviceTitle}
				</FilterBadge>
			)}
			{filters.state && (
				<FilterBadge
					icon={<MapPin className="h-3 w-3" />}
					onRemove={() => filters.setState("")}
				>
					{filters.state}
				</FilterBadge>
			)}
			{filters.selectedDays.map((day) => (
				<FilterBadge key={day} onRemove={() => filters.toggleDay(day)}>
					{DAYS.find((d) => d.key === day)?.label ?? day}
				</FilterBadge>
			))}
		</div>
	);
}

function FilterBadge({
	children,
	icon,
	onRemove,
}: {
	children: React.ReactNode;
	icon?: React.ReactNode;
	onRemove: () => void;
}) {
	return (
		<Badge
			variant="secondary"
			className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
		>
			{icon}
			{children}
			<button
				type="button"
				onClick={onRemove}
				className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
			>
				<X className="h-3 w-3" />
			</button>
		</Badge>
	);
}
