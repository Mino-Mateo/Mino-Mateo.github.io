// Validación algorítmica de números de tarjeta: Luhn + marca por prefijo (IIN) + longitud.
// No consulta ninguna red ni banco: solo dice si el número es estructuralmente consistente.
// Rangos: https://en.wikipedia.org/wiki/Payment_card_number (revisados 2026-09-29).

type Prefijo = string | [number, number];

export interface Marca {
  id: string;
  nombre: string;
  prefijos: Prefijo[];
  longitudes: number[];
}

export interface PasoLuhn {
  digito: number;
  duplicado: boolean;
  valor: number;
}

export interface ResultadoTarjeta {
  valido: boolean;
  mensaje: string;
  marca: Marca | null;
  pasos: PasoLuhn[];
  suma: number | null;
}

const rango = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export const MARCAS: Marca[] = [
  { id: "visa", nombre: "Visa", prefijos: ["4"], longitudes: [13, 16, 19] },
  { id: "mastercard", nombre: "Mastercard", prefijos: [[51, 55], [2221, 2720]], longitudes: [16] },
  { id: "amex", nombre: "American Express", prefijos: ["34", "37"], longitudes: [15] },
  { id: "discover", nombre: "Discover", prefijos: ["6011", [644, 649], "65", [622126, 622925]], longitudes: rango(16, 19) },
  { id: "diners", nombre: "Diners Club", prefijos: ["30", "36", "38", "39"], longitudes: rango(14, 19) },
  { id: "jcb", nombre: "JCB", prefijos: [[3528, 3589]], longitudes: rango(16, 19) },
  { id: "unionpay", nombre: "UnionPay", prefijos: ["62"], longitudes: rango(16, 19) },
  {
    id: "maestro",
    nombre: "Maestro",
    prefijos: ["5018", "5020", "5038", "5893", "6304", "6759", [6761, 6763]],
    longitudes: rango(12, 19),
  },
];

// Largo del prefijo que coincide (0 si no coincide). Gana el más largo: 622126 es Discover, no UnionPay.
function coincidencia(numero: string, p: Prefijo): number {
  if (typeof p === "string") return numero.startsWith(p) ? p.length : 0;
  const largo = String(p[0]).length;
  const n = Number(numero.slice(0, largo));
  return numero.length >= largo && n >= p[0] && n <= p[1] ? largo : 0;
}

export function detectarMarca(numero: string): Marca | null {
  let mejor: Marca | null = null;
  let largoMejor = 0;
  for (const marca of MARCAS) {
    for (const p of marca.prefijos) {
      const largo = coincidencia(numero, p);
      if (largo > largoMejor) {
        mejor = marca;
        largoMejor = largo;
      }
    }
  }
  return mejor;
}

// Desde la derecha, se duplica un dígito sí y otro no (sin contar el verificador); si pasa de 9, se resta 9.
export function pasosLuhn(numero: string): { pasos: PasoLuhn[]; suma: number } {
  const pasos = [...numero].map((c, i) => {
    const digito = Number(c);
    const duplicado = (numero.length - 1 - i) % 2 === 1;
    const doble = digito * 2;
    return { digito, duplicado, valor: duplicado ? (doble > 9 ? doble - 9 : doble) : digito };
  });
  return { pasos, suma: pasos.reduce((s, p) => s + p.valor, 0) };
}

export function digitoVerificador(cuerpo: string): number {
  return (10 - (pasosLuhn(cuerpo + "0").suma % 10)) % 10;
}

export function validarTarjeta(entrada: string): ResultadoTarjeta {
  const numero = entrada.replace(/[\s-]/g, "");
  const vacio = { marca: null, pasos: [], suma: null };

  if (!/^\d+$/.test(numero)) {
    return { valido: false, mensaje: "Formato inválido: solo dígitos, espacios o guiones", ...vacio };
  }
  if (numero.length < 12 || numero.length > 19) {
    return { valido: false, mensaje: `Longitud inválida: ${numero.length} dígitos (una tarjeta tiene entre 12 y 19)`, ...vacio };
  }

  const marca = detectarMarca(numero);
  const { pasos, suma } = pasosLuhn(numero);
  const base = { marca, pasos, suma };

  if (suma % 10 !== 0) {
    const esperado = digitoVerificador(numero.slice(0, -1));
    const recibido = numero.at(-1);
    return { valido: false, mensaje: `Dígito verificador incorrecto (esperado ${esperado}, recibido ${recibido})`, ...base };
  }
  if (!marca) {
    return { valido: false, mensaje: "Pasa Luhn, pero el prefijo no corresponde a ninguna marca soportada", ...base };
  }
  if (!marca.longitudes.includes(numero.length)) {
    return {
      valido: false,
      mensaje: `Longitud no válida para ${marca.nombre}: ${numero.length} dígitos (esperado ${marca.longitudes.join(", ")})`,
      ...base,
    };
  }
  return { valido: true, mensaje: `Número válido: ${marca.nombre}`, ...base };
}
