import type { ResultadoValidacion } from "./types";

const TABLA_VALORES = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
const FORMATO_CURP =
  /^[A-Z]{4}[0-9]{6}[HM][A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}[A-Z0-9][0-9]$/;

export function validarMexico(valorRaw: string): ResultadoValidacion {
  const valor = valorRaw.trim().toUpperCase();

  if (!FORMATO_CURP.test(valor)) {
    return { valido: false, mensaje: "Formato inválido" };
  }

  const mes = parseInt(valor.slice(6, 8), 10);
  const dia = parseInt(valor.slice(8, 10), 10);
  if (!(mes >= 1 && mes <= 12 && dia >= 1 && dia <= 31)) {
    return { valido: false, mensaje: "Formato inválido: fecha fuera de rango" };
  }

  let suma = 0;
  for (let i = 0; i < 17; i++) {
    const valorCaracter = TABLA_VALORES.indexOf(valor[i]);
    const peso = 18 - (i + 1);
    suma += valorCaracter * peso;
  }

  const esperado = (10 - (suma % 10)) % 10;
  const recibido = parseInt(valor[17], 10);

  if (esperado !== recibido) {
    return {
      valido: false,
      mensaje: `Dígito verificador incorrecto (esperado ${esperado}, recibido ${recibido})`,
    };
  }

  return { valido: true, mensaje: "CURP válido" };
}
