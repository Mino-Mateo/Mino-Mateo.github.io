import type { ResultadoValidacion } from "./types";

function digitoVerificador(digitos: number[], pesoInicial: number): number {
  let suma = 0;
  for (let i = 0; i < digitos.length; i++) {
    suma += digitos[i] * (pesoInicial - i);
  }
  const resto = suma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function validarBrasil(valorRaw: string): ResultadoValidacion {
  const valor = valorRaw.trim().replace(/[.\-]/g, "");

  if (!/^[0-9]{11}$/.test(valor)) {
    return { valido: false, mensaje: "Formato inválido: debe tener 11 dígitos numéricos" };
  }

  if (new Set(valor.split("")).size === 1) {
    return { valido: false, mensaje: "CPF inválido: todos los dígitos son iguales" };
  }

  const base = valor.slice(0, 9).split("").map(Number);
  const digito1 = digitoVerificador(base, 10);
  if (digito1 !== parseInt(valor[9], 10)) {
    return {
      valido: false,
      mensaje: `Dígito verificador incorrecto (esperado ${digito1}, recibido ${valor[9]})`,
    };
  }

  const digito2 = digitoVerificador([...base, digito1], 11);
  if (digito2 !== parseInt(valor[10], 10)) {
    return {
      valido: false,
      mensaje: `Dígito verificador incorrecto (esperado ${digito2}, recibido ${valor[10]})`,
    };
  }

  return { valido: true, mensaje: "CPF válido" };
}
