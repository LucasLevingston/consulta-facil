import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchDoctor(doctorId: string) {
  return await prisma.doctorDetails.findUnique({
    where: { userId: doctorId },
  });
}

const DoctorDetailsPage = async ({ params }: { params: { doctorId: string } }) => {
  const doctor = await fetchDoctor(params.doctorId);

  if (!doctor) {
    return <div>Profissional não encontrado.</div>;
  }

  return (
    <div>
      <h1>Detalhes do Doutor</h1>

      <h2>{doctor.name}</h2>
      <p>Especialidade: {doctor.specialty}</p>
      <p>Contato: {doctor.phone}</p>
      <p>Email: {doctor.email}</p>
      <p>Número do CRM: {doctor.licenseNumber}</p>
    </div>
  );
};

export default DoctorDetailsPage;
