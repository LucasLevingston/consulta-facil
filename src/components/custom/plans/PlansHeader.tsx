export const PlansHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="text-center">
    <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
      {title}
    </h1>
    <p className="pt-1 text-muted-foreground">{subtitle}</p>
  </section>
);
