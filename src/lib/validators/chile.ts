import type { ResultadoValidacion } from "./types";

const PESOS = [2, 3, 4, 5, 6, 7];

export function validarChile(valorRaw: string): ResultadoValidacion {
  const valor = valorRaw.trim().toUpperCase().replace(/\./g, "");

  const match = valor.match(/^([0-9]{7,8})-([0-9K])$/);
  if (!match) {
    return { valido: false, mensaje: "Formato inválido: use NNNNNNNN-V" };
  }

  const [, cuerpo, dv] = match;
  const digitos = cuerpo.split("").reverse();

  let suma = 0;
  for (let i = 0; i < digitos.length; i++) {
    suma += parseInt(digitos[i], 10) * PESOS[i % PESOS.length];
  }

  const resto = 11 - (suma % 11);
  let esperado: string;
  if (resto === 11) esperado = "0";
  else if (resto === 10) esperado = "K";
  else esperado = String(resto);

  if (esperado !== dv) {
    return {
      valido: false,
      mensaje: `Dígito verificador incorrecto (esperado ${esperado}, recibido ${dv})`,
    };
  }

  return { valido: true, mensaje: "RUT válido" };
}
