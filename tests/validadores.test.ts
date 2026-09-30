import { test } from "node:test";
import assert from "node:assert/strict";
import { validarEcuador } from "../src/lib/validators/ecuador.ts";
import { validarChile } from "../src/lib/validators/chile.ts";
import { validarMexico } from "../src/lib/validators/mexico.ts";
import { validarBrasil } from "../src/lib/validators/brasil.ts";

// CURP publicadas como válidas en los tests de python-stdnum (stdnum/mx/curp.py y tests/test_mx_curp.doctest)
const CURP_REFERENCIA = [
  "AAAA000101HDFCCC09",
  "AAMG890608HDFLJL00",
  "BAAA890317HDFRLL03",
  "BAAD890419HMNRRV07",
  "BEML920313HMCLNS09",
  "HEGG560427MVZRRL04",
  "HEGR891009HMNRRD09",
  "MARR890512HMNRMN09",
  "MESJ890928HMNZNS00",
  "OOMG890727HMNRSR06",
  "PEGL890909MJCRMS08",
  "TOMA880125HMNRRN02",
  "TOMA880125HMNRRNO2",
  "VIAA900930MMNCLL08",
];

test("CURP de referencia: todas válidas (pesos 18 a 2)", () => {
  for (const c of CURP_REFERENCIA) assert.equal(validarMexico(c).valido, true, `${c}: ${validarMexico(c).mensaje}`);
});

test("CURP: un verificador distinto se rechaza", () => {
  assert.match(validarMexico("BOXW310820HNERXN08").mensaje, /esperado 9, recibido 8/);
});

test("ejemplos ficticios de la demo son válidos", () => {
  assert.equal(validarEcuador("1234567897").valido, true);
  assert.equal(validarChile("12345678-5").valido, true);
  assert.equal(validarMexico("PELJ900101HPLRPN00").valido, true);
  assert.equal(validarBrasil("12345678909").valido, true);
});

test("CURP: estado inexistente se rechaza aunque el verificador cuadre", () => {
  assert.match(validarMexico("PEGL890909MQQRMS02").mensaje, /estado inexistente/);
});
