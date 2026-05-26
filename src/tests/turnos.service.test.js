import { describe, expect, it } from "@jest/globals";
import dayjs from "dayjs";

import { TurnoService } from "../services/turnos.service.js";

describe("TurnoService", () => {
  describe("getTurnosDisponibles", () => {
    it("debe retornar turnos disponibles con cobertura, costo y paginacion", async () => {
      const service = new TurnoService();

      const resultado = await service.getTurnosDisponibles({
        pacienteId: "1",
        especialidad: "Cardiologia",
        fechaDesde: dayjs().toDate(),
        fechaHasta: dayjs().add(7, "day").endOf("day").toDate(),
        page: 1,
        limit: 5,
        ordenarPor: "fecha",
        orden: "asc",
      });

      expect(resultado.items.length).toBeGreaterThan(0);
      expect(resultado.pagination.page).toBe(1);
      expect(resultado.pagination.limit).toBe(5);
      expect(resultado.items[0]).toEqual(
        expect.objectContaining({
          especialidad: "Cardiologia",
          practica: null,
          cobertura: "TOTAL",
          costoBase: 15000,
          costoPaciente: 0,
        }),
      );
    });

    it("debe lanzar error si fechaHasta es anterior a fechaDesde", async () => {
      const service = new TurnoService();

      await expect(
        service.getTurnosDisponibles({
          pacienteId: "1",
          especialidad: "Cardiologia",
          fechaDesde: dayjs().add(5, "day").toDate(),
          fechaHasta: dayjs().add(1, "day").toDate(),
          page: 1,
          limit: 10,
          ordenarPor: "fecha",
          orden: "asc",
        }),
      ).rejects.toThrow("La fechaHasta no puede ser anterior a fechaDesde");
    });
  });
});
