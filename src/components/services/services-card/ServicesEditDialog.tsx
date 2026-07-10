import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { ProfessionalService } from "@/features/services";
import { ServiceForm } from "./ServiceForm";

interface Props {
	editing: ProfessionalService | null;
	open: boolean;
	onOpenChange: (v: boolean) => void;
	onClose: () => void;
}

export function ServicesEditDialog({
	editing,
	open,
	onOpenChange,
	onClose,
}: Props) {
	return (
		<Dialog open={open && !!editing} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar serviço</DialogTitle>
				</DialogHeader>
				{editing && <ServiceForm existing={editing} onClose={onClose} />}
			</DialogContent>
		</Dialog>
	);
}
