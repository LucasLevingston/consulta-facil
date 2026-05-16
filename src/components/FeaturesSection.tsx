import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { areasData } from "@/constants/area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 md:px-6">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Recursos do ConsultaFácil
        </h2>
        <p className="mx-auto max-w-[700px] text-center text-muted-foreground mb-8">
          Descubra como o ConsultaFácil simplifica o agendamento de consultas médicas em
          diversas especialidades.
        </p>
        <div className="mx-auto max-w-5xl">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {areasData
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((area) => (
                  <CarouselItem
                    key={area.name}
                    className="md:basis-1/2 lg:basis-1/3 pl-4"
                  >
                    <Card className="dark:bg-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                      <CardHeader className="flex flex-col items-center justify-center pt-8 pb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                          <area.icon className="w-8 h-8 text-primary" />
                        </div>
                        <Image
                          src={`/images/specialties/${area.image}`}
                          alt={area.name}
                          width={64}
                          height={64}
                          className="mb-4 rounded-full"
                        />
                        <CardTitle className="text-xl text-center group-hover:text-primary transition-colors duration-300">
                          {area.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                          Encontre o melhor profissional da área da{" "}
                          {area.name.toLowerCase()} para você
                        </p>
                        <Link href={`/profissionais?specialty=${area.name}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                          >
                            Agendar
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Card>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
