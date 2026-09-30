import type { Segmento } from "./validators/anatomia";

// Dibuja el número partido en recuadros de colores y, debajo, qué significa cada parte.
// Solo clases (la CSP bloquea style=); los colores viven en Tools.astro.
export function dibujarAnatomia(caja: HTMLElement, segmentos: Segmento[] | null) {
  caja.hidden = !segmentos;
  if (!segmentos) return;
  const fila = document.createElement("div");
  fila.className = "anat-fila";
  const lista = document.createElement("ul");
  lista.className = "anat-lista";
  for (const s of segmentos) {
    const b = document.createElement("span");
    b.className = `anat-seg rol-${s.rol}`;
    b.textContent = s.texto;
    fila.append(b);
    const li = document.createElement("li");
    li.className = `rol-${s.rol}`;
    const t = document.createElement("strong");
    t.textContent = s.texto;
    li.append(t, ` ${s.nota}`);
    lista.append(li);
  }
  caja.replaceChildren(fila, lista);
}
