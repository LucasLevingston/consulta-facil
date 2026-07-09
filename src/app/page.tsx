import { BenefitsSection } from "@/components/BenefitsSection";
import { BottomCtaSection } from "@/components/BottomCtaSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";

export default function Home() {
	return (
		<main>
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

				<div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

				<div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
			</div>

			<HeroSection />
			<FeaturesSection />
			<BenefitsSection />
			<HowItWorksSection />
			<BottomCtaSection />
		</main>
	);
}
