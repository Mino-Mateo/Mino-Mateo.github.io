import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { leerExif, limpiarJpeg } from "../src/lib/exif.ts";

const cargar = (ruta: string) => {
  const b = readFileSync(new URL(ruta, import.meta.url));
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
};

test("foto de ejemplo (little endian): campos y GPS al sur y oeste", () => {
  const r = leerExif(cargar("../public/demo/foto-ejemplo.jpg"));
  const campos = Object.fromEntries(r.campos);
  assert.equal(campos["Marca"], "Demo");
  assert.equal(campos["Modelo"], "Camara de ejemplo");
  assert.equal(campos["Fecha de captura"], "2026:09:29 10:15:00");
  assert.deepEqual(r.gps, { lat: -0.2201, lon: -78.5125 });
});

test("big endian (formato de iPhone): marca y GPS al norte y este", () => {
  const r = leerExif(cargar("fixtures/big-endian.jpg"));
  assert.equal(Object.fromEntries(r.campos)["Marca"], "Apple");
  assert.deepEqual(r.gps, { lat: 40.446194, lon: 3.703472 });
});

test("limpiar quita el EXIF y conserva la imagen", () => {
  const original = cargar("../public/demo/foto-ejemplo.jpg");
  const limpio = limpiarJpeg(original);
  assert.ok(limpio.length < original.byteLength);
  const r = leerExif(limpio.buffer.slice(0) as ArrayBuffer);
  assert.deepEqual(r, { campos: [], gps: null });
  // Los datos comprimidos (desde SOS) son idénticos
  const sos = (b: Uint8Array) => { for (let i = 0; i < b.length - 1; i++) if (b[i] === 0xff && b[i + 1] === 0xda) return i; return -1; };
  const o = new Uint8Array(original);
  assert.deepEqual(limpio.subarray(sos(limpio)), o.subarray(sos(o)));
});

test("rechaza archivos que no son JPEG", () => {
  assert.throws(() => leerExif(new TextEncoder().encode("hola mundo").buffer), /No es un JPEG/);
});

test("JPEG sin EXIF devuelve vacío", () => {
  const limpio = limpiarJpeg(cargar("fixtures/big-endian.jpg"));
  assert.deepEqual(leerExif(limpio.buffer.slice(0) as ArrayBuffer), { campos: [], gps: null });
});
