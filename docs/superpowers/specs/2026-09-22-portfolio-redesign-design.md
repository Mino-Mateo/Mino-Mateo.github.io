# Rediseño del portafolio de Mateo Miño

## Contexto

El sitio actual (`Mino-Mateo.github.io`) es una plantilla Bootstrap/jQuery genérica de "estudiante desarrollador Full-Stack" (experiencia "3 meses", portafolio con imágenes placeholder, estadísticas infladas de "50 proyectos / 25 clientes"). No refleja el perfil profesional actual de Mateo: ciberseguridad, inteligencia y OSINT, Tech Lead & Seguridad Digital en eCondor Digital, y autor de herramientas reales (Intellify, Docentra, WordyGo, Jonezer App, Disnomia).

Objetivo: reconstruir el portafolio con una identidad visual seria y profesional ("dark, intel/dossier"), sin clichés de "hacker" (nada de verde matrix, terminales, calaveras), y con contenido real de sus proyectos.

## Stack

- **Astro** (sitio estático, sin backend). Se elige sobre mantener HTML/CSS/JS plano porque el usuario quiere estructura de componentes reutilizable para poder añadir proyectos futuros fácilmente.
- Sin frameworks de UI adicionales (no React/Vue) — Astro components puros + CSS propio.
- Despliegue: GitHub Pages (build de Astro a `dist/`, como ahora vía `Mino-Mateo.github.io`).
- Sin dependencias de jQuery ni plugins Bootstrap del template anterior.

## Estructura de contenido (single-page, secciones ancladas)

1. **Hero** — Nombre, rol ("Ciberseguridad · Inteligencia · OSINT"), bio corta, links a GitHub/LinkedIn.
2. **Sobre mí** — Texto breve, sin el modal de "habilidades" con barras de progreso genéricas (se elimina).
3. **Experiencia** — Solo eCondor Digital como entrada principal (Tech Lead & Seguridad Digital: "Arquitecto de soluciones escalables y protección esencial"). Se elimina toda la experiencia académica/temprana (EPN, certificado CMS, arreglo de equipos, asistencia técnica) — el foco queda 100% en lo profesional actual.
4. **Proyectos** — Grid de tarjetas, una por proyecto, con: nombre, descripción, rol de Mateo, stack tecnológico (tags en mono). Fuente de datos: array en `src/data/projects.ts` para facilitar añadir proyectos futuros sin tocar markup.
5. **eCondor Digital** — Sección separada para la empresa (no es "un proyecto más"): descripción breve de la empresa + rol de Mateo, link a https://econdordigital.org/.
6. **Contacto** — Formulario simplificado (nombre, email, mensaje). Se elimina el mailing list de Mailchimp y el `mailto` genérico viejo.
7. **Footer** — Links sociales (GitHub, LinkedIn, YouTube).

Se elimina: sección de "Servicios" con iconos genéricos, sección de estadísticas infladas ("50 proyectos", "25 clientes", "8000 horas"), modal de skills con barras de progreso.

### Datos de contenido confirmados

**Perfil:**
- Nombre: Mateo Miño
- GitHub: https://github.com/Mino-Mateo
- LinkedIn: https://www.linkedin.com/in/mateo-miño/
- YouTube: https://www.youtube.com/@mateomino-vc4hl

**eCondor Digital** (empresa, e minúscula / C mayúscula / sin tilde):
- Rol de Mateo: Tech Lead & Seguridad Digital — "Arquitecto de soluciones escalables y protección esencial"
- Empresa: software minimalista y moderno, desarrollo web/mobile, backend & APIs, UI/UX, consultoría tech, MVPs.
- URL: https://econdordigital.org/

**Proyectos:**

| Proyecto | Descripción | Rol de Mateo | Stack |
|---|---|---|---|
| Intellify | Sistema de ciberinteligencia para indexación de información, creación de fichas OSINT e investigación | Autoría completa | React, Python, SQL |
| Docentra | Sistema de evaluación docente y gestión académica | Backend, cálculos, base de datos | React, Bun, PostgreSQL, .NET |
| WordyGo | Sistema multirol de ejercicios de inglés, hecho para Salazar Editores | Backend, base de datos, sistemas de seguridad | React, Supabase, NestJS |
| Jonezer App | Aplicación móvil de gestión comercial (clientes, ventas, productos) | Funcionalidades de cálculo y roles | Flutter |
| Disnomia | Microservicio API para calificación de ejercicios educativos | Motor de evaluación | NestJS |

Ninguno de los proyectos tiene link público disponible — se muestran solo como tarjetas informativas (sin CTA de "ver proyecto").

## Estilo visual — "Dark intel/dossier"

- **Paleta:** fondo casi negro (`#0a0e14` / `#0d1117`), texto principal gris claro (`#e6e8eb`), un único acento frío (cian apagado `#4fd1c5` o azul acero `#5b8cff` — decidir en implementación) para links/bordes/hover. Sin colores saturados tipo "hacker".
- **Tipografía:** sans-serif limpia (Inter o similar) para cuerpo de texto; mono discreta (JetBrains Mono / IBM Plex Mono) solo para labels técnicos, tags de stack tecnológico y metadatos.
- **Tarjetas de proyecto:** borde fino de 1px, esquinas rectas (no redondeadas), tag de stack tecnológico en mono, estética de "ficha"/dossier.
- **Fondo hero:** grid o líneas muy tenues (opacidad ~3-5%), sin animaciones de partículas ni efectos "matrix".
- **Iconografía:** lineal/outline simple, consistente con el tema mono. Sin iconos de calavera/candado genéricos.
- Responsive: el sitio debe verse bien en mobile y desktop (breakpoints estándar, sin depender de Bootstrap grid).

## Testing / verificación

Sitio estático sin lógica de negocio — verificación es visual: `astro dev`, revisar todas las secciones en navegador (desktop + mobile), confirmar que los links funcionan y el formulario de contacto tiene validación básica de campos HTML (`required`, `type=email`).

## Fuera de alcance

- No se agregan proyectos con contenido inventado — solo los 5 confirmados arriba.
- No se implementa backend real para el formulario de contacto (puede quedar como `mailto:` o placeholder, a decidir en implementación si no hay servicio de envío).
- No se migra a CMS ni se añade blog.
