import type { ResultadoValidacion } from "./types";

const COEFICIENTES = [2, 1, 2, 1, 2, 1, 2, 1, 2];

export function validarEcuador(valorRaw: string): ResultadoValidacion {
  const valor = valorRaw.trim();

  if (!/^[0-9]{10}$/.test(valor)) {
    return { valido: false, mensaje: "Formato inválido: debe tener 10 dígitos numéricos" };
  }

  const provincia = parseInt(valor.slice(0, 2), 10);
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) {
    return { valido: false, mensaje: "Código de provincia inválido" };
  }

  const tercerDigito = parseInt(valor[2], 10);
  if (tercerDigito >= 6) {
    return { valido: false, mensaje: "Tercer dígito inválido para persona natural" };
  }

  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let producto = parseInt(valor[i], 10) * COEFICIENTES[i];
    if (producto > 9) producto -= 9;
    suma += producto;
  }

  const esperado = (10 - (suma % 10)) % 10;
  const recibido = parseInt(valor[9], 10);

  if (esperado !== recibido) {
    return {
      valido: false,
      mensaje: `Dígito verificador incorrecto (esperado ${esperado}, recibido ${recibido})`,
    };
  }

  return { valido: true, mensaje: "Cédula válida" };
}
