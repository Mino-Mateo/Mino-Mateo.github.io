import type { ResultadoValidacion } from "./types";
import { validarEcuador } from "./ecuador";
import { validarChile } from "./chile";
import { validarMexico } from "./mexico";
import { validarBrasil } from "./brasil";

export type { ResultadoValidacion };

export interface PaisValidador {
  id: string;
  nombre: string;
  placeholder: string;
  validar: (valor: string) => ResultadoValidacion;
}

export const paises: PaisValidador[] = [
  {
    id: "ecuador",
    nombre: "Ecuador — Cédula",
    placeholder: "1234567890",
    validar: validarEcuador,
  },
  {
    id: "chile",
    nombre: "Chile — RUT",
    placeholder: "12345678-5",
    validar: validarChile,
  },
  {
    id: "mexico",
    nombre: "México — CURP",
    placeholder: "XXXX000000XXXXXX00",
    validar: validarMexico,
  },
  {
    id: "brasil",
    nombre: "Brasil — CPF",
    placeholder: "12345678909",
    validar: validarBrasil,
  },
];
