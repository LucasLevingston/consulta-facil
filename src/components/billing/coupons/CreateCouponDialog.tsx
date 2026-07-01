"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
	type CreateCouponData,
	createCouponSchema,
	useAdminCreateCoupon,
} from "@/features/billing";
import { CreateCouponFormBasic } from "./CreateCouponFormBasic";
import { CreateCouponFormLimits } from "./CreateCouponFormLimits";

export function CreateCouponDialog() {
	const [open, setOpen] = useState(false);
	const create = useAdminCreateCoupon();

	const form = useForm<CreateCouponData>({
		resolver: zodResolver(createCouponSchema),
		defaultValues: { type: "PERCENT", maxUsesPerUser: 1 },
	});

	function onSubmit(data: CreateCouponData) {
		create.mutate(data, {
			onSuccess: () => {
				setOpen(false);
				form.reset();
			},
		});
	}

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
						<CreateCouponFormBasic form={form} />
						<CreateCouponFormLimits form={form} isPending={create.isPending} />
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
