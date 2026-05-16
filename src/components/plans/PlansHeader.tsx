import { TITLE_TAILWIND_CLASS } from "@/lib/utils";

export const PlansHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="text-center">
    <h1
      className={`${TITLE_TAILWIND_CLASS} text-4xl font-semibold tracking-tight dark:text-white text-gray-900`}
    >
      {title}
    </h1>
    <p className=" pt-1">{subtitle}</p>
    <br />
  </section>
);
