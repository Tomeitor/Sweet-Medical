import { afterAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";
import { medicoRepository } from "../repositories/medicos.repository.js";

const originalGetAll = medicoRepository.getAll;
const originalGetById = medicoRepository.getById;

const mockGetAll = jest.fn();
const mockGetById = jest.fn();

medicoRepository.getAll = mockGetAll;
medicoRepository.getById = mockGetById;

const API_PREFIX = process.env.PATH_APP || "/api/v1";

describe("Medicos integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    medicoRepository.getAll = originalGetAll;
    medicoRepository.getById = originalGetById;
  });

  it("should return all medicos", async () => {
    const medicos = [
      {
        id: "507f1f77bcf86cd799439011",
        usuario: "anagomez",
        matricula: "12345",
        nombre: "Dra. Ana Gomez",
        especialidades: ["Cardiologia"],
        practicas: ["Consulta"],
        sedes: ["Sede Centro"],
        eliminado: false,
      },
      {
        id: "507f191e810c19729de860ea",
        usuario: "jperez",
        matricula: "54321",
        nombre: "Dr. Juan Perez",
        especialidades: ["Clinica"],
        practicas: ["Control"],
        sedes: ["Sede Norte"],
        eliminado: false,
      },
    ];

    mockGetAll.mockResolvedValue(medicos);

    const response = await request(app).get(`${API_PREFIX}/medicos`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(medicos);
    expect(mockGetAll).toHaveBeenCalledTimes(1);
  });

  it("should return one medico by id", async () => {
    const medico = {
      id: "507f1f77bcf86cd799439011",
      usuario: "anagomez",
      matricula: "12345",
      nombre: "Dra. Ana Gomez",
      especialidades: ["Cardiologia"],
      practicas: ["Consulta"],
      sedes: ["Sede Centro"],
      eliminado: false,
    };

    mockGetById.mockResolvedValue(medico);

    const response = await request(app).get(
      `${API_PREFIX}/medicos/507f1f77bcf86cd799439011`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(medico);
    expect(mockGetById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });
});
