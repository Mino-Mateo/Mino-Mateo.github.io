import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizarDominio, urlRdap, resumirRdap, registrosDns, evaluarCorreo, fechaWayback } from "../src/lib/dominio.ts";

const fixture = (n: string) => JSON.parse(readFileSync(new URL(`fixtures/${n}`, import.meta.url), "utf8"));

test("normaliza URLs, mayúsculas, www y dominios con tilde", () => {
  assert.equal(normalizarDominio("  HTTPS://www.EPN.edu.ec/carreras?x=1 "), "epn.edu.ec");
  assert.equal(normalizarDominio("econdordigital.org:443"), "econdordigital.org");
  assert.equal(normalizarDominio("mateomiño.ec"), "xn--mateomio-j3a.ec");
});

test("rechaza entradas que no son dominios", () => {
  for (const x of ["", "localhost", "192.168.1.1", "hola mundo", "-malo.com", "a..b.com"]) {
    assert.equal(normalizarDominio(x), null, x);
  }
});

test("RDAP solo para la lista fija de TLD", () => {
  assert.equal(urlRdap("epn.edu.ec"), "https://rdap.registry.ec/domain/epn.edu.ec");
  assert.equal(urlRdap("github.com"), "https://rdap.verisign.com/com/v1/domain/github.com");
  assert.equal(urlRdap("gob.pe"), null);
});

test("RDAP .ec: registrador y fechas, sin contactos", () => {
  const r = resumirRdap(fixture("rdap-ec.json"));
  assert.match(r.registrador!, /REINEC/);
  assert.equal(r.creado, "2011-04-16");
  assert.equal(r.vence, "2036-01-26");
  assert.deepEqual(r.estado, ["active"]);
});

test("RDAP .org: servidores DNS en minúsculas", () => {
  const r = resumirRdap(fixture("rdap-org.json"));
  assert.equal(r.registrador, "Name.com, Inc.");
  assert.deepEqual(r.ns, ["mckinley.ns.cloudflare.com", "nero.ns.cloudflare.com"]);
});

test("DNS: filtra por tipo y quita comillas de TXT", () => {
  const j = { Answer: [
    { type: 5, data: "alias.example." },
    { type: 16, data: "\"v=spf1 include:_spf.google.com \" \"~all\"" },
    { type: 1, data: "203.0.113.7" },
  ] };
  assert.deepEqual(registrosDns(j, "TXT"), ["v=spf1 include:_spf.google.com ~all"]);
  assert.deepEqual(registrosDns(j, "A"), ["203.0.113.7"]);
  assert.deepEqual(registrosDns({ Status: 3 }, "MX"), []);
});

test("correo: protegido, p=none y sin registros", () => {
  const spf = ["v=spf1 -all"];
  assert.equal(evaluarCorreo(spf, ["v=DMARC1; p=reject"]).resumen, "Correo protegido: SPF y DMARC con p=reject");
  assert.equal(evaluarCorreo(spf, ["v=DMARC1; p=none; rua=mailto:x@y.z"]).resumen, "Correo suplantable: DMARC en modo p=none");
  const c = evaluarCorreo(["google-site-verification=abc"], []);
  assert.equal(c.suplantable, true);
  assert.equal(c.resumen, "Correo suplantable: sin SPF, sin DMARC");
});

test("Wayback: fecha de la captura o null", () => {
  assert.equal(fechaWayback({ archived_snapshots: { closest: { timestamp: "20040512093000" } } }), "2004-05-12");
  assert.equal(fechaWayback({ archived_snapshots: {} }), null);
  assert.equal(fechaWayback(null), null);
});
