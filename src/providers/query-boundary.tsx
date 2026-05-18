import { cn } from "@/lib/utils";
import { LoadingPage } from "../components/custom/loading/loading-page";
import { PageLayout } from "../components/custom/page-layout";

interface QueryBoundaryProps {
   isLoading: boolean;
   error: unknown;
   children: React.ReactNode;
   className?: string;
}

export function QueryBoundary({
   isLoading,
   error,
   children,
   className,
}: QueryBoundaryProps) {
   if (isLoading) {
      return <LoadingPage />;
   }

   if (error) {
      return <div className={className}>Erro ao carregar dados</div>;
   }

   return (<PageLayout className={cn(className, "")}>

      {children}
   </PageLayout>
   );
}