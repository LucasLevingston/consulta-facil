"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	Calendar,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Clock,
	FlaskConical,
	Loader2,
	MapPin,
	Navigation,
	Phone,
	Search,
	SlidersHorizontal,
	X,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAvailableSlots } from "@/hooks/api/exam-labs/use-available-slots";
import { useExamLabs } from "@/hooks/api/exam-labs/use-exam-labs";
import { useExamLabsNearby } from "@/hooks/api/exam-labs/use-exam-labs-nearby";
import { useScheduleExam } from "@/hooks/api/exam-labs/use-schedule-exam";
import type { ExamLabResponse } from "@/lib/schemas/examLab/exam-lab-response.schema";
import { cn } from "@/lib/utils/cn";
import { QueryBoundary } from "@/providers/query-boundary";
import { ALL } from "@/utils/constants/filter-sentinels";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";

const DAY_LABELS: Record<string, string> = {
	MONDAY: "Seg",
	TUESDAY: "Ter",
	WEDNESDAY: "Qua",
	THURSDAY: "Qui",
	FRIDAY: "Sex",
	SATURDAY: "Sáb",
	SUNDAY: "Dom",
};

const DAY_ORDER = [
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
];

function formatTime(time: string) {
	return time.slice(0, 5);
}

// ── Slot picker dialog ────────────────────────────────────────────────────────

function SlotPickerDialog({
	lab,
	examRequestId,
	open,
	onClose,
}: {
	lab: ExamLabResponse;
	examRequestId: string | null;
	open: boolean;
	onClose: () => void;
}) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const { mutateAsync: scheduleExam, isPending } = useScheduleExam();

	const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

	const { data: slots = [], isLoading: slotsLoading } = useAvailableSlots(
		open ? lab.id : null,
		open ? dateStr : null,
	);

	async function handleConfirm() {
		if (!selectedDate || !selectedTime || !examRequestId) return;
		try {
			await scheduleExam({
				examRequestId,
				examLabId: lab.id,
				scheduledDate: format(selectedDate, "yyyy-MM-dd"),
				scheduledTime: selectedTime,
			});
			toast.success("Exame agendado com sucesso!");
			onClose();
		} catch {
			toast.error("Erro ao agendar exame. Tente novamente.");
		}
	}

	function handleClose() {
		setSelectedDate(undefined);
		setSelectedTime(null);
		onClose();
	}

	const availableSlots = slots.filter((s) => s.available);

	return (
		<Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
			<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-base">
						<FlaskConical className="h-5 w-5 text-primary shrink-0" />
						{lab.name}
					</DialogTitle>
					{(lab.address || lab.city) && (
						<p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
							<MapPin className="h-3.5 w-3.5 shrink-0" />
							{[lab.address, lab.city].filter(Boolean).join(", ")}
						</p>
					)}
				</DialogHeader>

				<Separator />

				{/* Step 1 — choose date */}
				<div className="space-y-2">
					<p className="text-sm font-medium flex items-center gap-1.5">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						Escolha a data
					</p>
					<div className="flex justify-center">
						<CalendarPicker
							mode="single"
							selected={selectedDate}
							onSelect={(d) => {
								setSelectedDate(d);
								setSelectedTime(null);
							}}
							disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
							locale={ptBR}
							className="rounded-xl border"
						/>
					</div>
				</div>

				{/* Step 2 — choose time */}
				{selectedDate && (
					<div className="space-y-2">
						<p className="text-sm font-medium flex items-center gap-1.5">
							<Clock className="h-4 w-4 text-muted-foreground" />
							Horários disponíveis
							{slotsLoading && (
								<Loader2 className="h-3.5 w-3.5 animate-spin ml-1 text-muted-foreground" />
							)}
						</p>

						{!slotsLoading && slots.length === 0 && (
							<p className="text-sm text-muted-foreground text-center py-6 rounded-xl bg-muted/40">
								Laboratório fechado nesta data.
							</p>
						)}

						{!slotsLoading &&
							slots.length > 0 &&
							availableSlots.length === 0 && (
								<p className="text-sm text-muted-foreground text-center py-6 rounded-xl bg-muted/40">
									Todos os horários estão ocupados nesta data.
								</p>
							)}

						{!slotsLoading && slots.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{slots.map((slot) => (
									<button
										key={slot.time}
										type="button"
										aria-label={`Horário ${formatTime(slot.time)}${!slot.available ? ", indisponível" : ""}`}
										aria-pressed={selectedTime === slot.time}
										disabled={!slot.available}
										onClick={() => setSelectedTime(slot.time)}
										className={cn(
											// min 44px touch target
											"min-h-[44px] px-4 rounded-xl text-sm font-medium border transition-colors duration-150",
											!slot.available &&
												"opacity-40 cursor-not-allowed bg-muted text-muted-foreground border-border",
											slot.available &&
												selectedTime !== slot.time &&
												"bg-background hover:bg-muted border-border text-foreground cursor-pointer",
											selectedTime === slot.time &&
												"bg-primary text-primary-foreground border-primary cursor-pointer",
										)}
									>
										{formatTime(slot.time)}
									</button>
								))}
							</div>
						)}
					</div>
				)}

				{/* Step 3 — confirm */}
				{selectedDate && selectedTime && (
					<div className="space-y-3">
						<Separator />
						<div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-sm space-y-0.5">
							<p className="font-semibold text-primary">
								Resumo do agendamento
							</p>
							<p className="text-muted-foreground">
								{format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
									locale: ptBR,
								})}{" "}
								às {formatTime(selectedTime)}
							</p>
						</div>

						<Button
							className="w-full gap-2 min-h-[44px]"
							onClick={handleConfirm}
							disabled={isPending}
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<CheckCircle2 className="h-4 w-4" />
							)}
							{isPending ? "Agendando..." : "Confirmar agendamento"}
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

// ── Lab card ──────────────────────────────────────────────────────────────────

function LabCard({
	lab,
	examRequestId,
}: {
	lab: ExamLabResponse;
	examRequestId: string | null;
}) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [showHours, setShowHours] = useState(false);

	const sortedHours = useMemo(
		() =>
			[...(lab.hours ?? [])].sort(
				(a, b) =>
					DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek),
			),
		[lab.hours],
	);

	const openDays = sortedHours.filter((h) => h.isOpen);
	const hasHours = sortedHours.length > 0;

	return (
		<>
			<Card className="flex flex-col h-full transition-shadow duration-200 hover:shadow-md">
				{lab.imageUrl && (
					<div className="relative h-44 overflow-hidden rounded-t-xl bg-muted">
						<Image
							src={lab.imageUrl}
							alt={lab.name}
							fill
							unoptimized
							className="object-cover"
						/>
					</div>
				)}

				<CardContent className="flex flex-col flex-1 p-5 gap-3">
					{/* Name + description */}
					<div>
						<h3 className="font-semibold text-base leading-tight">
							{lab.name}
						</h3>
						{lab.description && (
							<p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
								{lab.description}
							</p>
						)}
					</div>

					{/* Location + phone */}
					<div className="space-y-1">
						{(lab.address || lab.city) && (
							<p className="text-xs text-muted-foreground flex items-start gap-1.5">
								<MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
								{[lab.address, lab.city, lab.state].filter(Boolean).join(", ")}
							</p>
						)}
						{lab.phone && (
							<p className="text-xs text-muted-foreground flex items-center gap-1.5">
								<Phone className="h-3.5 w-3.5 shrink-0" />
								{lab.phone}
							</p>
						)}
					</div>

					{/* Accepted exams */}
					{lab.acceptedExams && lab.acceptedExams.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{lab.acceptedExams.slice(0, 4).map((e) => (
								<Badge key={e} variant="secondary" className="text-xs">
									{e}
								</Badge>
							))}
							{lab.acceptedExams.length > 4 && (
								<Badge variant="outline" className="text-xs">
									+{lab.acceptedExams.length - 4} mais
								</Badge>
							)}
						</div>
					)}

					{/* Hours toggle */}
					{hasHours && (
						<div>
							<button
								type="button"
								onClick={() => setShowHours((v) => !v)}
								aria-expanded={showHours}
								className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer min-h-[36px]"
							>
								<Clock className="h-3.5 w-3.5 shrink-0" />
								{openDays.length > 0
									? `Aberto ${openDays.length}x por semana`
									: "Ver horários"}
								{showHours ? (
									<ChevronUp className="h-3 w-3" />
								) : (
									<ChevronDown className="h-3 w-3" />
								)}
							</button>

							{showHours && (
								<div className="mt-2 rounded-xl border bg-muted/40 p-3 space-y-1.5">
									{sortedHours.map((h) => (
										<div
											key={h.dayOfWeek}
											className={cn(
												"flex justify-between text-xs",
												h.isOpen
													? "text-foreground"
													: "text-muted-foreground opacity-50",
											)}
										>
											<span className="font-medium w-8 shrink-0">
												{DAY_LABELS[h.dayOfWeek] ?? h.dayOfWeek}
											</span>
											<span>
												{h.isOpen
													? `${formatTime(h.openTime)} – ${formatTime(h.closeTime)}`
													: "Fechado"}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* CTA */}
					<div className="mt-auto pt-1">
						{examRequestId ? (
							<Button
								className="w-full gap-2 min-h-[44px]"
								size="sm"
								onClick={() => setDialogOpen(true)}
							>
								<Calendar className="h-4 w-4" />
								Agendar aqui
							</Button>
						) : (
							<Button
								variant="outline"
								className="w-full gap-2 min-h-[44px]"
								size="sm"
								onClick={() => setShowHours((v) => !v)}
							>
								<Clock className="h-4 w-4" />
								{showHours ? "Ocultar horários" : "Ver horários"}
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{examRequestId && (
				<SlotPickerDialog
					lab={lab}
					examRequestId={examRequestId}
					open={dialogOpen}
					onClose={() => setDialogOpen(false)}
				/>
			)}
		</>
	);
}

// ── Page ─────────────────────────────────────────────────────────────────────

function LaboratoriesPageContent() {
	const searchParams = useSearchParams();
	const examRequestId = searchParams.get("examId");

	const [search, setSearch] = useState("");
	const [filterState, setFilterState] = useState("");
	const [filterCity, setFilterCity] = useState("");
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [radiusKm, setRadiusKm] = useState(50);
	const [expanded, setExpanded] = useState(false);

	const isNearbyMode = userLocation !== null;

	const {
		data: allLabs = [],
		isLoading: allLoading,
		error: allError,
	} = useExamLabs();
	const {
		data: nearbyLabs = [],
		isLoading: nearbyLoading,
		error: nearbyError,
	} = useExamLabsNearby(
		userLocation?.lat ?? null,
		userLocation?.lng ?? null,
		radiusKm,
	);

	const isLoading = isNearbyMode ? nearbyLoading : allLoading;
	const error = isNearbyMode ? nearbyError : allError;

	const availableStates = useMemo(
		() =>
			[...new Set(allLabs.flatMap((l) => (l.state ? [l.state] : [])))].sort(),
		[allLabs],
	);

	const baseList = isNearbyMode ? nearbyLabs : allLabs;

	const displayed = useMemo(() => {
		let result = baseList;
		if (search.trim())
			result = result.filter(
				(l) =>
					l.name.toLowerCase().includes(search.toLowerCase()) ||
					l.acceptedExams?.some((e) =>
						e.toLowerCase().includes(search.toLowerCase()),
					),
			);
		if (filterState) result = result.filter((l) => l.state === filterState);
		if (filterCity)
			result = result.filter((l) =>
				l.city?.toLowerCase().includes(filterCity.toLowerCase()),
			);
		return result;
	}, [baseList, search, filterState, filterCity]);

	const totalActive = [search, filterState, filterCity].filter(Boolean).length;
	const advancedCount = [filterCity].filter(Boolean).length;

	function clearFilters() {
		setSearch("");
		setFilterState("");
		setFilterCity("");
	}

	function requestLocation() {
		if (!navigator.geolocation) return;
		setLocationLoading(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setUserLocation({
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				});
				setLocationLoading(false);
			},
			() => setLocationLoading(false),
		);
	}

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PageHeader
				title="Laboratórios de Exames"
				description={
					examRequestId
						? "Selecione um laboratório para agendar seu exame."
						: "Encontre laboratórios para realizar seus exames."
				}
				icon={<FlaskConical className="h-6 w-6" />}
				count={displayed.length}
				countLabel="laboratório"
			/>

			{/* Schedule mode banner */}
			{examRequestId && (
				<div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 mb-1">
					<FlaskConical className="h-4 w-4 text-primary shrink-0" />
					<p className="text-sm text-primary">
						Escolha um laboratório e clique em <strong>Agendar aqui</strong>{" "}
						para marcar seu exame.
					</p>
				</div>
			)}

			<div className="space-y-3">
				{/* Filter row */}
				<div className="flex flex-wrap items-center gap-2">
					<div className="relative min-w-[180px] flex-1 max-w-xs">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
						<Input
							placeholder="Buscar por laboratório ou exame..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-8 rounded-xl"
						/>
					</div>

					<Select
						value={filterState || ALL}
						onValueChange={(v) => setFilterState(v === ALL ? "" : v)}
					>
						<SelectTrigger className="w-[130px] rounded-xl">
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
								<SelectValue placeholder="Estado" />
							</div>
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value={ALL}>Todos os estados</SelectItem>
							{availableStates.map((s) => (
								<SelectItem key={s} value={s}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button
						variant="outline"
						size="sm"
						onClick={() => setExpanded((v) => !v)}
						className="rounded-xl gap-2 shrink-0"
					>
						<SlidersHorizontal className="h-4 w-4" />
						Mais filtros
						{advancedCount > 0 && (
							<Badge className="h-5 min-w-5 px-1.5 text-[10px] leading-none">
								{advancedCount}
							</Badge>
						)}
						{expanded ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}
					</Button>

					{totalActive > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearFilters}
							className="gap-1.5 text-muted-foreground rounded-xl"
						>
							<X className="h-3.5 w-3.5" />
							Limpar ({totalActive})
						</Button>
					)}

					{/* Nearby toggle */}
					<div className="ml-auto flex items-center gap-2">
						{isNearbyMode ? (
							<div className="flex items-center gap-2">
								<Select
									value={String(radiusKm)}
									onValueChange={(v) => setRadiusKm(Number(v))}
								>
									<SelectTrigger className="h-9 w-[100px] rounded-xl text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl">
										{RADIUS_OPTIONS.map(({ value, label }) => (
											<SelectItem key={value} value={value}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Badge
									variant="secondary"
									className="gap-1.5 px-3 py-1.5 rounded-full text-sm"
								>
									<Navigation className="h-3.5 w-3.5 text-primary" />
									Perto de você ({radiusKm}km)
									<button
										type="button"
										aria-label="Remover localização"
										onClick={() => setUserLocation(null)}
										className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
									>
										<X className="h-3.5 w-3.5" />
									</button>
								</Badge>
							</div>
						) : (
							<Button
								variant="outline"
								size="sm"
								onClick={requestLocation}
								disabled={locationLoading}
								className="rounded-xl gap-2"
							>
								{locationLoading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Navigation className="h-4 w-4" />
								)}
								Perto de mim
							</Button>
						)}
					</div>
				</div>

				{/* Advanced filters */}
				{expanded && (
					<div className="rounded-xl border border-border bg-muted/30 p-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
						<div className="max-w-xs space-y-1.5">
							<label
								htmlFor="filter-city"
								className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"
							>
								<MapPin className="h-3.5 w-3.5" />
								Cidade
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
								<Input
									id="filter-city"
									placeholder="Ex: João Pessoa, Campina Grande..."
									value={filterCity}
									onChange={(e) => setFilterCity(e.target.value)}
									className="pl-9 h-9 rounded-xl text-sm"
								/>
							</div>
						</div>
					</div>
				)}

				{/* Active filter chips */}
				{totalActive > 0 && (
					<div className="flex flex-wrap gap-2">
						{search && (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1 rounded-full text-xs"
							>
								<Search className="h-3 w-3" />
								&ldquo;{search}&rdquo;
								<button
									type="button"
									aria-label="Remover busca"
									onClick={() => setSearch("")}
									className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{filterState && (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1 rounded-full text-xs"
							>
								<MapPin className="h-3 w-3" />
								{filterState}
								<button
									type="button"
									aria-label="Remover filtro de estado"
									onClick={() => setFilterState("")}
									className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{filterCity && (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1 rounded-full text-xs"
							>
								<MapPin className="h-3 w-3" />
								{filterCity}
								<button
									type="button"
									aria-label="Remover filtro de cidade"
									onClick={() => setFilterCity("")}
									className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
					</div>
				)}

				{/* Lab grid */}
				{displayed.length === 0 ? (
					<div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
							<FlaskConical className="h-6 w-6 text-muted-foreground" />
						</div>
						<h3 className="mt-4 text-sm font-semibold">
							Nenhum laboratório encontrado
						</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							Tente ajustar os filtros ou buscar por outro exame.
						</p>
						{totalActive > 0 && (
							<Button
								variant="outline"
								size="sm"
								className="mt-4"
								onClick={clearFilters}
							>
								Limpar filtros
							</Button>
						)}
					</div>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{displayed.map((lab) => (
							<LabCard key={lab.id} lab={lab} examRequestId={examRequestId} />
						))}
					</div>
				)}
			</div>
		</QueryBoundary>
	);
}

export default function LaboratoriesPage() {
	return (
		<Suspense>
			<LaboratoriesPageContent />
		</Suspense>
	);
}
