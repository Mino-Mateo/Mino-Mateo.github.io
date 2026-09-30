// Lector mínimo de EXIF para JPEG y limpieza sin recomprimir.
// Solo lee los campos que muestra la demo; el detalle completo va en el repo.

export interface Exif {
  campos: Array<[string, string]>;
  gps: { lat: number; lon: number } | null;
}

const TAGS: Record<number, string> = {
  0x010f: "Marca",
  0x0110: "Modelo",
  0x0131: "Software",
  0x0132: "Fecha de modificación",
  0x9003: "Fecha de captura",
  0xa434: "Lente",
};

// Recorre los segmentos del JPEG hasta el inicio de la imagen comprimida (SOS)
function segmentos(v: DataView): Array<{ marker: number; inicio: number; fin: number }> {
  if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) throw new Error("No es un JPEG");
  const lista = [];
  let i = 2;
  while (i + 4 <= v.byteLength && v.getUint8(i) === 0xff) {
    const marker = v.getUint8(i + 1);
    if (marker === 0xda) break;
    const fin = i + 2 + v.getUint16(i + 2);
    lista.push({ marker, inicio: i, fin });
    i = fin;
  }
  return lista;
}

function esExif(v: DataView, s: { marker: number; inicio: number }): boolean {
  return s.marker === 0xe1 && v.getUint32(s.inicio + 4) === 0x45786966; // "Exif"
}

export function leerExif(buffer: ArrayBuffer): Exif {
  const v = new DataView(buffer);
  const app1 = segmentos(v).find((s) => esExif(v, s));
  const campos: Array<[string, string]> = [];
  if (!app1) return { campos, gps: null };

  const t = app1.inicio + 10; // inicio del bloque TIFF
  const le = v.getUint16(t) === 0x4949; // "II" = little endian
  const u16 = (o: number) => v.getUint16(t + o, le);
  const u32 = (o: number) => v.getUint32(t + o, le);

  // Devuelve { tag: [tipo, cuenta, offset del valor] } de un IFD
  function ifd(off: number) {
    const tags = new Map<number, [number, number, number]>();
    const n = u16(off);
    for (let k = 0; k < n; k++) {
      const e = off + 2 + k * 12;
      const tipo = u16(e + 2);
      const cuenta = u32(e + 4);
      const tam = ({ 2: 1, 3: 2, 4: 4, 5: 8 } as Record<number, number>)[tipo] ?? 1;
      tags.set(u16(e), [tipo, cuenta, tam * cuenta > 4 ? u32(e + 8) : e + 8]);
    }
    return tags;
  }
  const texto = ([, cuenta, off]: [number, number, number]) =>
    String.fromCharCode(...new Uint8Array(buffer, t + off, cuenta)).replace(/\0+$/, "").trim();
  const racional = (off: number) => u32(off) / (u32(off + 4) || 1);

  const ifd0 = ifd(u32(4));
  const exif = ifd0.has(0x8769) ? ifd(u32(ifd0.get(0x8769)![2])) : new Map();
  for (const tags of [ifd0, exif]) {
    for (const [tag, e] of tags) if (TAGS[tag] && e[0] === 2) campos.push([TAGS[tag], texto(e)]);
  }

  let gps: Exif["gps"] = null;
  if (ifd0.has(0x8825)) {
    const g = ifd(u32(ifd0.get(0x8825)![2]));
    const grados = (tag: number) => {
      const off = g.get(tag)![2];
      return racional(off) + racional(off + 8) / 60 + racional(off + 16) / 3600;
    };
    if (g.has(2) && g.has(4)) {
      const ref = (tag: number) => String.fromCharCode(v.getUint8(t + g.get(tag)![2]));
      const lat = grados(2) * (ref(1) === "S" ? -1 : 1);
      const lon = grados(4) * (ref(3) === "W" ? -1 : 1);
      gps = { lat: Math.round(lat * 1e6) / 1e6, lon: Math.round(lon * 1e6) / 1e6 };
      campos.push(["Ubicación GPS", `${gps.lat}, ${gps.lon}`]);
    }
  }
  return { campos, gps };
}

// Copia el JPEG sin los bloques de metadatos (EXIF/XMP en APP1, IPTC en APP13, comentarios).
// No recomprime: la imagen queda idéntica, pero pierde la orientación guardada en EXIF.
export function limpiarJpeg(buffer: ArrayBuffer): Uint8Array<ArrayBuffer> {
  const v = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const quitar = new Set([0xe1, 0xed, 0xfe]);
  const lista = segmentos(v);
  const finCabecera = lista.length ? lista[lista.length - 1].fin : 2;
  const partes = [bytes.subarray(0, 2), ...lista.filter((s) => !quitar.has(s.marker)).map((s) => bytes.subarray(s.inicio, s.fin)), bytes.subarray(finCabecera)];
  const salida = new Uint8Array(partes.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of partes) {
    salida.set(p, o);
    o += p.length;
  }
  return salida;
}
