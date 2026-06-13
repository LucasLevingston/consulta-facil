"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Tag } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useAdminCoupons,
	useAdminCouponUsages,
	useAdminCreateCoupon,
	useAdminUpdateCoupon,
} from "@/hooks/api/billing/use-coupons";
import type { CouponResponse } from "@/lib/schemas/billing/coupon.schema";
import {
	type CreateCouponData,
	createCouponSchema,
	type UpdateCouponData,
	updateCouponSchema,
} from "@/lib/schemas/billing/coupon.schema";

const brl = (n: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(n);

const STATUS_LABELS: Record<string, string> = {
	ACTIVE: "Ativo",
	INACTIVE: "Inativo",
	EXPIRED: "Expirado",
};

const STATUS_VARIANTS: Record<
	string,
	"default" | "secondary" | "destructive" | "outline"
> = {
	ACTIVE: "default",
	INACTIVE: "secondary",
	EXPIRED: "destructive",
};

function CreateCouponDialog() {
	const [open, setOpen] = useState(false);
	const create = useAdminCreateCoupon();

	const form = useForm<CreateCouponData>({
		resolver: zodResolver(createCouponSchema),
		defaultValues: {
			type: "PERCENT",
			maxUsesPerUser: 1,
		},
	});

	const onSubmit = (data: CreateCouponData) => {
		create.mutate(data, {
			onSuccess: () => {
				setOpen(false);
				form.reset();
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					Novo Cupom
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Criar Cupom</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Código</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="DESCONTO20"
											onChange={(e) =>
												field.onChange(e.target.value.toUpperCase())
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Cupom de desconto" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="PERCENT">Percentual (%)</SelectItem>
												<SelectItem value="FIXED">Fixo (R$)</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Valor</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												min="0.01"
												step="0.01"
												onChange={(e) => field.onChange(e.target.valueAsNumber)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="maxUses"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Máx. usos total</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												min="1"
												placeholder="Ilimitado"
												onChange={(e) =>
													field.onChange(
														Number.isNaN(e.target.valueAsNumber)
															? undefined
															: e.target.valueAsNumber,
													)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="maxUsesPerUser"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Máx. por usuário</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												min="1"
												onChange={(e) => field.onChange(e.target.valueAsNumber)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="expiresAt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expira em</FormLabel>
									<FormControl>
										<Input {...field} type="date" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={create.isPending}
						>
							{create.isPending ? "Criando..." : "Criar Cupom"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

function EditCouponDialog({ coupon }: { coupon: CouponResponse }) {
	const [open, setOpen] = useState(false);
	const update = useAdminUpdateCoupon();

	const form = useForm<UpdateCouponData>({
		resolver: zodResolver(updateCouponSchema),
		defaultValues: {
			description: coupon.description ?? "",
			status: coupon.status,
			maxUses: coupon.maxUses ?? undefined,
			expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
		},
	});

	const onSubmit = (data: UpdateCouponData) => {
		update.mutate({ id: coupon.id, data }, { onSuccess: () => setOpen(false) });
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					Editar
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Editar Cupom — {coupon.code}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="ACTIVE">Ativo</SelectItem>
												<SelectItem value="INACTIVE">Inativo</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="maxUses"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Máx. usos total</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												min="1"
												placeholder="Ilimitado"
												onChange={(e) =>
													field.onChange(
														Number.isNaN(e.target.valueAsNumber)
															? undefined
															: e.target.valueAsNumber,
													)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="expiresAt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expira em</FormLabel>
									<FormControl>
										<Input {...field} type="date" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={update.isPending}
						>
							{update.isPending ? "Salvando..." : "Salvar"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminCouponsPage() {
	const { data: coupons = [], isLoading: loadingCoupons } = useAdminCoupons();
	const { data: usages = [], isLoading: loadingUsages } =
		useAdminCouponUsages();

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-start justify-between">
				<PageHeader
					title="Cupons"
					description="Gerencie cupons de desconto e histórico de uso."
					icon={<Tag className="h-6 w-6" />}
				/>
				<CreateCouponDialog />
			</div>

			<Tabs defaultValue="codes">
				<TabsList>
					<TabsTrigger value="codes">Cupons ({coupons.length})</TabsTrigger>
					<TabsTrigger value="usages">Histórico ({usages.length})</TabsTrigger>
				</TabsList>

				<TabsContent value="codes" className="mt-4">
					{loadingCoupons ? (
						<p className="text-sm text-muted-foreground">Carregando...</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Código</TableHead>
									<TableHead>Tipo</TableHead>
									<TableHead>Valor</TableHead>
									<TableHead>Usos</TableHead>
									<TableHead>Expira em</TableHead>
									<TableHead>Status</TableHead>
									<TableHead />
								</TableRow>
							</TableHeader>
							<TableBody>
								{coupons.map((c) => (
									<TableRow key={c.id}>
										<TableCell className="font-mono font-semibold">
											{c.code}
										</TableCell>
										<TableCell>{c.type === "PERCENT" ? "%" : "R$"}</TableCell>
										<TableCell>
											{c.type === "PERCENT" ? `${c.value}%` : brl(c.value)}
										</TableCell>
										<TableCell>
											{c.currentUses}
											{c.maxUses ? ` / ${c.maxUses}` : ""}
										</TableCell>
										<TableCell>
											{c.expiresAt
												? new Date(c.expiresAt).toLocaleDateString("pt-BR")
												: "—"}
										</TableCell>
										<TableCell>
											<Badge variant={STATUS_VARIANTS[c.status] ?? "outline"}>
												{STATUS_LABELS[c.status] ?? c.status}
											</Badge>
										</TableCell>
										<TableCell>
											<EditCouponDialog coupon={c} />
										</TableCell>
									</TableRow>
								))}
								{coupons.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={7}
											className="text-center text-muted-foreground"
										>
											Nenhum cupom cadastrado.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</TabsContent>

				<TabsContent value="usages" className="mt-4">
					{loadingUsages ? (
						<p className="text-sm text-muted-foreground">Carregando...</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Usuário</TableHead>
									<TableHead>Cupom</TableHead>
									<TableHead>Desconto</TableHead>
									<TableHead>Data</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{usages.map((u) => (
									<TableRow key={u.id}>
										<TableCell className="font-mono text-xs">
											{u.userId.slice(0, 8)}...
										</TableCell>
										<TableCell className="font-mono">
											{u.couponCode ?? u.couponId}
										</TableCell>
										<TableCell>{brl(u.discountAmount)}</TableCell>
										<TableCell>
											{new Date(u.usedAt).toLocaleDateString("pt-BR")}
										</TableCell>
									</TableRow>
								))}
								{usages.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={4}
											className="text-center text-muted-foreground"
										>
											Nenhum uso registrado.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
