import { Logo } from "@/components/logo";
import { Loading } from "./";

export function LoadingPage() {
	return (
		<div className="container mx-auto py-8">
			<div>
				<div className="flex items-center justify-center py-8 flex-col gap-4">
					<Logo />
					<Loading />
				</div>
			</div>
		</div>
	);
}
