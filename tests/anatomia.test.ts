import { test } from "node:test";
import assert from "node:assert/strict";
import { anatomia } from "../src/lib/validators/anatomia.ts";

const unir = (s: ReturnType<typeof anatomia>) => s!.map((x) => x.texto).join("");

test("Ecuador: provincia, tipo, secuencia y verificador", () => {
  const s = anatomia("ecuador", "1714567890")!;
  assert.deepEqual(s.map((x) => x.rol), ["origen", "tipo", "secuencia", "verificador"]);
  assert.equal(s[0].nota, "Provincia: Pichincha");
  assert.equal(unir(s), "1714567890");
  assert.equal(anatomia("ecuador", "3012345678")![0].nota, "Provincia: Ecuatorianos registrados en el exterior");
  assert.equal(anatomia("ecuador", "123"), null);
});

test("Chile: con y sin puntos, K como verificador", () => {
  assert.deepEqual(anatomia("chile", "12.345.678-5")!.map((x) => x.texto), ["12345678", "5"]);
  assert.deepEqual(anatomia("chile", "7654321k")!.map((x) => x.texto), ["7654321", "K"]);
  assert.equal(anatomia("chile", "12.345.678-Z"), null);
});

test("México: CURP ficticia partida en 7 segmentos", () => {
  const s = anatomia("mexico", "PELJ900101HPLRPN02")!;
  assert.equal(unir(s), "PELJ900101HPLRPN02");
  assert.equal(s[1].nota, "Nacimiento: 01/01/90");
  assert.equal(s[3].nota, "Estado: Puebla");
  assert.equal(s[5].nota, "Homoclave: nacido antes de 2000");
  assert.equal(anatomia("mexico", "PELJ000101MNELRPA3")![5].nota, "Homoclave: nacido desde 2000");
});

test("Brasil: el noveno dígito es la región fiscal", () => {
  const s = anatomia("brasil", "123.456.789-09")!;
  assert.deepEqual(s.map((x) => x.texto), ["12345678", "9", "09"]);
  assert.equal(s[1].nota, "Región fiscal: PR, SC");
});

import { anatomiaTarjeta } from "../src/lib/validators/anatomia.ts";

test("Tarjeta: IIN, cuenta y verificador", () => {
  const s = anatomiaTarjeta("4242 4242 4242 4242", "Visa")!;
  assert.deepEqual(s.map((x) => x.texto), ["424242", "424242424", "2"]);
  assert.equal(s[0].nota, "Emisor (IIN): Visa; el 4 inicial = banca y finanzas");
  assert.equal(anatomiaTarjeta("12ab", null), null);
});
