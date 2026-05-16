import { getAllDoctors } from "@/lib/actions/doctor.actions";
import DoctorCard from "./_components/doctorCard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DoctorFilters from "./_components/DoctorFilters";

export interface SearchParams {
  specialty?: string;
  location?: string;
  availability?: string;
  name?: string; // Adiciona o parâmetro de busca por nome
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="flex size-full flex-col gap-4 p-4 md:p-8 lg:p-12">
      <h1 className="text-2xl font-bold">
        Lista de profissionais cadastrados na nossa plataforma
      </h1>
      <DoctorFilters />
      <Suspense fallback={<DoctorsListSkeleton />}>
        <DoctorsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
async function DoctorsList({ searchParams }: { searchParams: SearchParams }) {
  const doctors = await getAllDoctors();

  // Filtrando médicos com base nos parâmetros de busca
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty = searchParams.specialty
      ? doctor.specialty === searchParams.specialty
      : true;

    // const matchesLocation = searchParams.location
    //   ? doctor.location === searchParams.location
    //   : true;

    // const matchesAvailability = searchParams.availability
    //   ? doctor.availability === searchParams.availability
    //   : true;

    const matchesName = searchParams.name
      ? doctor.name?.toLowerCase().includes(searchParams.name.toLowerCase())
      : true;

    return matchesSpecialty && matchesName;
    //  && matchesLocation && matchesAvailability;
  });

  if (filteredDoctors.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Nenhum médico encontrado com os filtros selecionados.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredDoctors.map((doctor) => (
        <DoctorCard doctor={doctor} key={doctor.userId} />
      ))}
    </div>
  );
}

function DoctorsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-full" />
      ))}
    </div>
  );
}
