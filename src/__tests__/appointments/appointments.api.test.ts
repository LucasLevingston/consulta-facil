import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { appointmentsApi } from "@/lib/api/appointments.api";
import { appointmentKeys } from "@/hooks/api/use-appointments";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);

const appointment = {
  id: "a-1",
  patientId: "p-1",
  doctorId: "d-1",
  scheduledAt: "2026-05-20T10:00:00Z",
  status: "PENDING" as const,
};

const page = { content: [appointment], totalElements: 1, totalPages: 1, number: 0 };

describe("appointmentsApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getByPatient — chama GET /appointments/patient/:id com paginação", async () => {
    mockGet.mockResolvedValueOnce({ data: page });

    const result = await appointmentsApi.getByPatient("p-1", 0, 10);

    expect(mockGet).toHaveBeenCalledWith("/appointments/patient/p-1", { params: { page: 0, size: 10 } });
    expect(result.content).toHaveLength(1);
  });

  it("schedule — chama POST /appointments e retorna a consulta criada", async () => {
    mockPost.mockResolvedValueOnce({ data: appointment });

    const result = await appointmentsApi.schedule({
      doctorId: "d-1",
      scheduledAt: "2026-05-20T10:00:00Z",
    });

    expect(mockPost).toHaveBeenCalledWith("/appointments", expect.objectContaining({ doctorId: "d-1" }));
    expect(result.status).toBe("PENDING");
  });

  it("cancel — chama PUT /appointments/:id/cancel com o motivo", async () => {
    const canceled = { ...appointment, status: "CANCELED" as const };
    mockPut.mockResolvedValueOnce({ data: canceled });

    const result = await appointmentsApi.cancel("a-1", { cancellationReason: "Viagem" });

    expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/cancel", { cancellationReason: "Viagem" });
    expect(result.status).toBe("CANCELED");
  });
});

describe("appointmentKeys", () => {
  it("byPatient gera a query key correta", () => {
    expect(appointmentKeys.byPatient("p-1")).toEqual(["appointments", "patient", "p-1"]);
  });

  it("detail gera a query key correta", () => {
    expect(appointmentKeys.detail("a-1")).toEqual(["appointments", "a-1"]);
  });
});
