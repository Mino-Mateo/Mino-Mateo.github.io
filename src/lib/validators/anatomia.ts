// Partes de cada número y qué significan, para dibujarlas con colores en las demos.
// Roles: origen (lugar), tipo, datos (personales, solo CURP), secuencia, verificador (se calcula).

export type Rol = "origen" | "tipo" | "datos" | "secuencia" | "verificador";

export interface Segmento {
  texto: string;
  rol: Rol;
  nota: string;
}

export const ROLES: Record<Rol, string> = {
  origen: "Lugar",
  tipo: "Tipo",
  datos: "Datos de la persona",
  secuencia: "Secuencia",
  verificador: "Dígito verificador (se calcula)",
};

const PROVINCIAS_EC: Record<string, string> = {
  "01": "Azuay", "02": "Bolívar", "03": "Cañar", "04": "Carchi", "05": "Cotopaxi", "06": "Chimborazo",
  "07": "El Oro", "08": "Esmeraldas", "09": "Guayas", "10": "Imbabura", "11": "Loja", "12": "Los Ríos",
  "13": "Manabí", "14": "Morona Santiago", "15": "Napo", "16": "Pastaza", "17": "Pichincha", "18": "Tungurahua",
  "19": "Zamora Chinchipe", "20": "Galápagos", "21": "Sucumbíos", "22": "Orellana",
  "23": "Santo Domingo de los Tsáchilas", "24": "Santa Elena", "30": "Ecuatorianos registrados en el exterior",
};

export const ESTADOS_MX: Record<string, string> = {
  AS: "Aguascalientes", BC: "Baja California", BS: "Baja California Sur", CC: "Campeche", CS: "Chiapas",
  CH: "Chihuahua", CL: "Coahuila", CM: "Colima", DF: "Ciudad de México", DG: "Durango", GT: "Guanajuato",
  GR: "Guerrero", HG: "Hidalgo", JC: "Jalisco", MC: "Estado de México", MN: "Michoacán", MS: "Morelos",
  NT: "Nayarit", NL: "Nuevo León", OC: "Oaxaca", PL: "Puebla", QT: "Querétaro", QR: "Quintana Roo",
  SP: "San Luis Potosí", SL: "Sinaloa", SR: "Sonora", TC: "Tabasco", TS: "Tamaulipas", TL: "Tlaxcala",
  VZ: "Veracruz", YN: "Yucatán", ZS: "Zacatecas", NE: "Nacido en el extranjero",
};

const REGIONES_BR: Record<string, string> = {
  "1": "DF, GO, MS, MT, TO", "2": "AC, AM, AP, PA, RO, RR", "3": "CE, MA, PI", "4": "AL, PB, PE, RN",
  "5": "BA, SE", "6": "MG", "7": "ES, RJ", "8": "SP", "9": "PR, SC", "0": "RS",
};

const seg = (texto: string, rol: Rol, nota: string): Segmento => ({ texto, rol, nota });

// null si el valor no tiene la forma del documento (la demo solo explica lo que puede partir)
export function anatomia(pais: string, entrada: string): Segmento[] | null {
  const v = entrada.trim().toUpperCase();
  if (pais === "ecuador" && /^\d{10}$/.test(v)) {
    return [
      seg(v.slice(0, 2), "origen", `Provincia: ${PROVINCIAS_EC[v.slice(0, 2)] ?? "código inexistente"}`),
      seg(v[2], "tipo", "Tercer dígito: de 0 a 5 para personas naturales"),
      seg(v.slice(3, 9), "secuencia", "Número consecutivo"),
      seg(v[9], "verificador", "Módulo 10 con coeficientes 2,1,2,1..."),
    ];
  }
  if (pais === "chile") {
    const limpio = v.replace(/[.\s]/g, "");
    const m = limpio.match(/^(\d{1,8})-?([\dK])$/);
    if (!m) return null;
    return [
      seg(m[1], "secuencia", "Número de RUN o RUT asignado"),
      seg(m[2], "verificador", "Módulo 11 con pesos 2 a 7 (10 = K, 11 = 0)"),
    ];
  }
  if (pais === "mexico" && /^[A-ZÑ]{4}\d{6}[HMX][A-Z]{2}[A-ZÑ]{3}[A-Z\d]\d$/.test(v)) {
    const f = v.slice(4, 10);
    return [
      seg(v.slice(0, 4), "datos", "Iniciales de apellidos y nombre"),
      seg(f, "datos", `Nacimiento: ${f.slice(4, 6)}/${f.slice(2, 4)}/${f.slice(0, 2)}`),
      seg(v[10], "datos", { H: "Sexo: hombre", M: "Sexo: mujer", X: "Sexo: no binario" }[v[10]]!),
      seg(v.slice(11, 13), "origen", `Estado: ${ESTADOS_MX[v.slice(11, 13)] ?? "clave inexistente"}`),
      seg(v.slice(13, 16), "datos", "Consonantes internas de apellidos y nombre"),
      seg(v[16], "secuencia", /\d/.test(v[16]) ? "Homoclave: nacido antes de 2000" : "Homoclave: nacido desde 2000"),
      seg(v[17], "verificador", "Suma ponderada de los 17 caracteres, módulo 10"),
    ];
  }
  if (pais === "brasil") {
    const d = v.replace(/[.\-\s]/g, "");
    if (!/^\d{11}$/.test(d)) return null;
    return [
      seg(d.slice(0, 8), "secuencia", "Número base"),
      seg(d[8], "origen", `Región fiscal: ${REGIONES_BR[d[8]]}`),
      seg(d.slice(9), "verificador", "Dos dígitos, módulo 11 con pesos 10 a 2 y 11 a 2"),
    ];
  }
  return null;
}

// ISO/IEC 7812: el primer dígito (MII) indica la industria del emisor
const MII: Record<string, string> = {
  "1": "aerolíneas", "2": "aerolíneas y finanzas", "3": "viajes y entretenimiento", "4": "banca y finanzas",
  "5": "banca y finanzas", "6": "comercio y banca", "7": "petroleras", "8": "salud y telecomunicaciones",
  "9": "asignación nacional", "0": "ISO/TC 68",
};

export function anatomiaTarjeta(entrada: string, marca: string | null): Segmento[] | null {
  const d = entrada.replace(/[\s-]/g, "");
  if (!/^\d{12,19}$/.test(d)) return null;
  return [
    seg(d.slice(0, 6), "origen", `Emisor (IIN): ${marca ?? "marca no reconocida"}; el ${d[0]} inicial = ${MII[d[0]]}`),
    seg(d.slice(6, -1), "secuencia", "Número de cuenta"),
    seg(d.slice(-1), "verificador", "Algoritmo de Luhn"),
  ];
}
