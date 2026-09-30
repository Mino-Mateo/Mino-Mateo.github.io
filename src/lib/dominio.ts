// Ficha pasiva de un dominio: RDAP, DNS (dns.google) y primera captura en Wayback.
// Solo se muestran datos técnicos: nunca registrante ni contactos (el RDAP de .ec expone nombres).

// Lista fija para que la CSP (connect-src) no tenga que abrirse a cualquier servidor HTTPS
const RDAP: Record<string, string> = {
  com: "https://rdap.verisign.com/com/v1/",
  net: "https://rdap.verisign.com/net/v1/",
  org: "https://rdap.publicinterestregistry.org/rdap/",
  ec: "https://rdap.registry.ec/",
  app: "https://pubapi.registry.google/rdap/",
  dev: "https://pubapi.registry.google/rdap/",
  br: "https://rdap.registro.br/",
  ar: "https://rdap.nic.ar/",
};
export const TLDS_RDAP = Object.keys(RDAP);

export function normalizarDominio(entrada: string): string | null {
  const limpio = entrada.trim().toLowerCase().replace(/^[a-z]+:\/\//, "").split(/[/?#:]/)[0].replace(/^www\./, "");
  let host: string;
  try {
    host = new URL(`http://${limpio}`).hostname; // convierte dominios con tildes a punycode
  } catch {
    return null;
  }
  return /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/.test(host) ? host : null;
}

export function urlRdap(dominio: string): string | null {
  const base = RDAP[dominio.split(".").pop()!];
  return base ? `${base}domain/${dominio}` : null;
}

export interface Rdap {
  registrador: string | null;
  creado: string | null;
  vence: string | null;
  estado: string[];
  ns: string[];
}

export function resumirRdap(j: any): Rdap {
  const evento = (accion: string) => j.events?.find((e: any) => e.eventAction === accion)?.eventDate?.slice(0, 10) ?? null;
  const registrador = j.entities?.find((e: any) => e.roles?.includes("registrar"));
  const fn = registrador?.vcardArray?.[1]?.find((x: any[]) => x[0] === "fn")?.[3] ?? null;
  return {
    registrador: fn,
    creado: evento("registration"),
    vence: evento("expiration"),
    estado: j.status ?? [],
    ns: (j.nameservers ?? []).map((n: any) => String(n.ldhName).toLowerCase()),
  };
}

const TIPOS: Record<string, number> = { A: 1, NS: 2, MX: 15, TXT: 16 };

export function registrosDns(j: any, tipo: keyof typeof TIPOS): string[] {
  return (j.Answer ?? [])
    .filter((a: any) => a.type === TIPOS[tipo])
    .map((a: any) => String(a.data).replace(/^"|"$/g, "").replace(/"\s*"/g, ""));
}

export interface Correo {
  spf: string | null;
  dmarc: string | null;
  politica: string | null;
  suplantable: boolean;
  resumen: string;
}

export function evaluarCorreo(txt: string[], dmarcTxt: string[]): Correo {
  const spf = txt.find((t) => /^v=spf1\b/i.test(t)) ?? null;
  const dmarc = dmarcTxt.find((t) => /^v=DMARC1\b/i.test(t)) ?? null;
  const politica = dmarc?.match(/\bp=(\w+)/i)?.[1]?.toLowerCase() ?? null;
  const faltas = [!spf && "sin SPF", !dmarc && "sin DMARC", politica === "none" && "DMARC en modo p=none"].filter(Boolean);
  return {
    spf,
    dmarc,
    politica,
    suplantable: faltas.length > 0,
    resumen: faltas.length
      ? `Correo suplantable: ${faltas.join(", ")}`
      : `Correo protegido: SPF y DMARC con p=${politica}`,
  };
}

export function fechaWayback(j: any): string | null {
  const ts: string | undefined = j?.archived_snapshots?.closest?.timestamp;
  return ts ? `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}` : null;
}
