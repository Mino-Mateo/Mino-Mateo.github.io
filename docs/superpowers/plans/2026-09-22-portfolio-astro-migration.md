# Portfolio Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el portafolio actual (plantilla Bootstrap/jQuery genérica de "estudiante Full-Stack") por un sitio Astro con estilo "dark intel/dossier" y el contenido real de Mateo Miño (ciberseguridad, OSINT, eCondor Digital, 5 proyectos).

**Architecture:** Sitio estático Astro, single-page con secciones ancladas (`#home #about #experience #projects #company #contact`), cada sección es un componente Astro (`src/components/*.astro`) importado y ensamblado en `src/pages/index.astro`, con datos de proyectos en un archivo TypeScript separado (`src/data/projects.ts`) para facilitar añadir proyectos futuros sin tocar markup. CSS propio con variables de diseño (sin Bootstrap/jQuery).

**Tech Stack:** Astro (^4.x), TypeScript (config base de Astro), CSS plano con custom properties, Google Fonts (Inter + JetBrains Mono), despliegue vía GitHub Actions a GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-22-portfolio-redesign-design.md`

## Global Constraints

- Nombre exacto de la empresa: **"eCondor Digital"** (e minúscula, C mayúscula, sin tilde) — en todo el sitio, sin excepciones.
- Paleta: fondo `#0a0e14`, fondo elevado (tarjetas) `#0d1117`, texto `#e6e8eb`, texto atenuado `#8b949e`, acento `#4fd1c5` (cian apagado — decisión final tomada en este plan), bordes `#23272f`. Un único color de acento, sin colores saturados adicionales.
- Tipografía: `Inter` (sans-serif) para cuerpo de texto; `JetBrains Mono` solo para labels técnicos, tags de stack y metadatos — nunca para párrafos largos.
- Sin jQuery, sin Bootstrap, sin frameworks de UI adicionales a Astro puro.
- Exactamente 5 proyectos, sin inventar contenido ni links no confirmados: Intellify, Docentra, WordyGo, Jonezer App, Disnomia — con la descripción, rol y stack exactos de la tabla en la spec.
- Sin sección de "Servicios" genérica, sin estadísticas infladas, sin modal de skills con barras de progreso — todos eliminados según la spec.
- Sin experiencia académica/temprana (EPN, certificado CMS, etc.) — solo eCondor Digital en la sección Experiencia.

---

### Task 1: Scaffold del proyecto Astro

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`

**Interfaces:**
- Produces: comando `npm run dev` (servidor local), `npm run build` (genera `dist/`), `npm run preview`.

- [ ] **Step 1: Crear `package.json`**

```json
{
  "name": "mino-mateo-portfolio",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.15.0"
  }
}
```

- [ ] **Step 2: Crear `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mino-mateo.github.io',
});
```

- [ ] **Step 3: Crear `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/base"
}
```

- [ ] **Step 4: Crear `src/pages/index.astro` (placeholder)**

```astro
---
---
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Placeholder</title>
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>
```

- [ ] **Step 5: Instalar dependencias**

Run: `npm install`
Expected: instala Astro sin errores, crea `node_modules/` y `package-lock.json`.

- [ ] **Step 6: Verificar build**

Run: `npm run build && grep -o "Hello" dist/index.html`
Expected: imprime `Hello` (confirma que Astro compila y genera `dist/index.html`).

- [ ] **Step 7: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json src/pages/index.astro package-lock.json
git commit -m "chore: scaffold Astro project"
```

---

### Task 2: Tokens de diseño globales (CSS)

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: custom properties CSS (`--color-bg`, `--color-bg-elevated`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-border`, `--font-sans`, `--font-mono`, `--space-1`..`--space-8`, `--max-width`), clases utilitarias `.container`, `.section`, `.section-title`, `.tag`, `.btn`, `.btn-outline`.

- [ ] **Step 1: Crear `src/styles/global.css`**

```css
:root {
  --color-bg: #0a0e14;
  --color-bg-elevated: #0d1117;
  --color-text: #e6e8eb;
  --color-text-muted: #8b949e;
  --color-accent: #4fd1c5;
  --color-border: #23272f;

  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-6: 4rem;
  --space-8: 6rem;

  --max-width: 1100px;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: 1.6;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-3);
}

.section {
  padding: var(--space-8) 0;
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: var(--space-2);
}

h1, h2, h3 {
  font-weight: 600;
  margin: 0 0 var(--space-2) 0;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}
a:hover { text-decoration: underline; }

.tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent);
  border: 1px solid var(--color-border);
  padding: 0.15rem 0.5rem;
  display: inline-block;
}

.btn {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid var(--color-accent);
  color: var(--color-accent) !important;
  text-decoration: none !important;
  display: inline-block;
  cursor: pointer;
  background: transparent;
}
.btn:hover { background: var(--color-accent); color: var(--color-bg) !important; }

.btn-outline { border-color: var(--color-border); color: var(--color-text-muted) !important; }
.btn-outline:hover { border-color: var(--color-accent); color: var(--color-accent) !important; background: transparent; }
```

- [ ] **Step 2: Importar el CSS en `src/pages/index.astro` (temporal, se moverá al layout en Task 3)**

```astro
---
import '../styles/global.css';
---
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Placeholder</title>
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>
```

- [ ] **Step 3: Verificar que el CSS se compila con las variables correctas**

Run: `npm run build && grep -o -- "--color-bg: #0a0e14" dist/_astro/*.css`
Expected: imprime `--color-bg: #0a0e14` (confirma que el archivo de tokens se incluyó en el build).

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/pages/index.astro
git commit -m "feat: add dark intel/dossier design tokens"
```

---

### Task 3: BaseLayout + Nav

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Nav.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `../styles/global.css` (Task 2).
- Produces: componente `BaseLayout` con props `{ title: string; description: string }` y `<slot />` para el contenido de cada página; componente `Nav` sin props.

- [ ] **Step 1: Crear `src/components/Nav.astro`**

```astro
---
const links = [
  { href: "#about", label: "Sobre mí" },
  { href: "#experience", label: "Experiencia" },
  { href: "#projects", label: "Proyectos" },
  { href: "#company", label: "eCondor Digital" },
  { href: "#contact", label: "Contacto" },
];
---
<header class="nav">
  <div class="container nav-inner">
    <a href="#home" class="nav-logo">MATEO MIÑO</a>
    <nav>
      <ul class="nav-links">
        {links.map((link) => (
          <li><a href={link.href}>{link.label}</a></li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(10, 14, 20, 0.9);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--color-border);
}
.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) var(--space-3);
}
.nav-logo {
  font-family: var(--font-mono);
  color: var(--color-text) !important;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-decoration: none !important;
}
.nav-links {
  list-style: none;
  display: flex;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
}
.nav-links a {
  color: var(--color-text-muted) !important;
  font-size: 0.9rem;
  text-decoration: none !important;
}
.nav-links a:hover { color: var(--color-accent) !important; }

@media (max-width: 640px) {
  .nav-links { gap: var(--space-2); font-size: 0.8rem; flex-wrap: wrap; }
}
</style>
```

- [ ] **Step 2: Crear `src/layouts/BaseLayout.astro`**

```astro
---
import Nav from '../components/Nav.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta name="author" content="Mateo Miño" />
    <link rel="icon" href="/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <title>{title}</title>
  </head>
  <body>
    <Nav />
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Reescribir `src/pages/index.astro` para usar el layout**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Mateo Miño — Ciberseguridad, Inteligencia y OSINT"
  description="Portafolio de Mateo Miño: Tech Lead & Seguridad Digital, autor de herramientas de ciberinteligencia e investigación OSINT."
>
  <p>Hello</p>
</BaseLayout>
```

- [ ] **Step 4: Verificar**

Run: `npm run build && grep -o "Sobre mí" dist/index.html`
Expected: imprime `Sobre mí` (confirma que el Nav se renderiza dentro del layout).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Nav.astro src/pages/index.astro
git commit -m "feat: add base layout and navigation"
```

---

### Task 4: Sección Hero

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: sección `<section id="home">` con el nombre, rol y links de contacto.

- [ ] **Step 1: Crear `src/components/Hero.astro`**

```astro
---
---
<section id="home" class="hero">
  <div class="hero-grid-bg"></div>
  <div class="container hero-content">
    <p class="section-title">Ciberseguridad · Inteligencia · OSINT</p>
    <h1>Mateo Miño</h1>
    <p class="hero-bio">
      Tech Lead & Seguridad Digital. Diseño y construyo herramientas de
      inteligencia, investigación e infraestructura segura.
    </p>
    <div class="hero-links">
      <a class="btn" href="https://github.com/Mino-Mateo" target="_blank" rel="noopener">GitHub</a>
      <a class="btn btn-outline" href="https://www.linkedin.com/in/mateo-miño/" target="_blank" rel="noopener">LinkedIn</a>
    </div>
  </div>
</section>

<style>
.hero {
  position: relative;
  padding: var(--space-8) 0;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}
.hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.05;
  pointer-events: none;
}
.hero-content { position: relative; }
.hero-bio {
  max-width: 560px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}
.hero-links { display: flex; gap: var(--space-2); flex-wrap: wrap; }
</style>
```

- [ ] **Step 2: Actualizar `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
---
<BaseLayout
  title="Mateo Miño — Ciberseguridad, Inteligencia y OSINT"
  description="Portafolio de Mateo Miño: Tech Lead & Seguridad Digital, autor de herramientas de ciberinteligencia e investigación OSINT."
>
  <Hero />
</BaseLayout>
```

- [ ] **Step 3: Verificar**

Run: `npm run build && grep -o "id=\"home\"" dist/index.html && grep -o "Mateo Miño" dist/index.html | head -1`
Expected: ambos comandos encuentran coincidencias.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add hero section"
```

---

### Task 5: Sección About

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear `src/components/About.astro`**

```astro
---
---
<section id="about" class="section">
  <div class="container">
    <p class="section-title">[ 01 ] Sobre mí</p>
    <p class="about-text">
      Me dedico a la ciberseguridad y la inteligencia digital. Diseño
      herramientas de investigación (OSINT), arquitecturas seguras y
      sistemas de indexación de información. Actualmente lidero la parte
      técnica y de seguridad en eCondor Digital.
    </p>
  </div>
</section>

<style>
.about-text {
  max-width: 640px;
  color: var(--color-text-muted);
}
</style>
```

- [ ] **Step 2: Actualizar `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
---
<BaseLayout
  title="Mateo Miño — Ciberseguridad, Inteligencia y OSINT"
  description="Portafolio de Mateo Miño: Tech Lead & Seguridad Digital, autor de herramientas de ciberinteligencia e investigación OSINT."
>
  <Hero />
  <About />
</BaseLayout>
```

- [ ] **Step 3: Verificar**

Run: `npm run build && grep -o "id=\"about\"" dist/index.html`
Expected: encuentra coincidencia.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.astro src/pages/index.astro
git commit -m "feat: add about section"
```

---

### Task 6: Sección Experiencia

**Files:**
- Create: `src/components/Experience.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear `src/components/Experience.astro`**

```astro
---
---
<section id="experience" class="section">
  <div class="container">
    <p class="section-title">[ 02 ] Experiencia</p>
    <div class="experience-item">
      <h3>Tech Lead & Seguridad Digital</h3>
      <p class="experience-company">eCondor Digital</p>
      <p class="experience-desc">
        Arquitecto de soluciones escalables y protección esencial. Software
        minimalista y moderno: desarrollo web/mobile, backend & APIs, UI/UX,
        consultoría técnica y MVPs.
      </p>
    </div>
  </div>
</section>

<style>
.experience-item {
  border-left: 2px solid var(--color-accent);
  padding-left: var(--space-3);
}
.experience-company {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}
.experience-desc { color: var(--color-text-muted); max-width: 560px; }
</style>
```

- [ ] **Step 2: Actualizar `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Experience from '../components/Experience.astro';
---
<BaseLayout
  title="Mateo Miño — Ciberseguridad, Inteligencia y OSINT"
  description="Portafolio de Mateo Miño: Tech Lead & Seguridad Digital, autor de herramientas de ciberinteligencia e investigación OSINT."
>
  <Hero />
  <About />
  <Experience />
</BaseLayout>
```

- [ ] **Step 3: Verificar**

Run: `npm run build && grep -o "Tech Lead &amp; Seguridad Digital" dist/index.html`
Expected: encuentra coincidencia (Astro escapa el `&` como `&amp;` en el HTML generado).

- [ ] **Step 4: Commit**

```bash
git add src/components/Experience.astro src/pages/index.astro
git commit -m "feat: add experience section"
```

---

### Task 7: Datos de proyectos + tarjeta + sección Proyectos

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/Projects.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `interface Project { name: string; description: string; role: string; stack: string[]; }` y `export const projects: Project[]` (5 elementos) desde `src/data/projects.ts`. `ProjectCard` consume props `{ name, description, role, stack }`.

- [ ] **Step 1: Crear `src/data/projects.ts`**

```ts
export interface Project {
  name: string;
  description: string;
  role: string;
  stack: string[];
}

export const projects: Project[] = [
  {
    name: "Intellify",
    description:
      "Sistema de ciberinteligencia para indexación de información, creación de fichas OSINT e investigación.",
    role: "Autoría completa",
    stack: ["React", "Python", "SQL"],
  },
  {
    name: "Docentra",
    description: "Sistema de evaluación docente y gestión académica.",
    role: "Backend, cálculos, base de datos",
    stack: ["React", "Bun", "PostgreSQL", ".NET"],
  },
  {
    name: "WordyGo",
    description:
      "Sistema multirol de ejercicios de inglés, hecho para Salazar Editores.",
    role: "Backend, base de datos, sistemas de seguridad",
    stack: ["React", "Supabase", "NestJS"],
  },
  {
    name: "Jonezer App",
    description:
      "Aplicación móvil de gestión comercial: clientes, ventas y productos.",
    role: "Funcionalidades de cálculo y roles",
    stack: ["Flutter"],
  },
  {
    name: "Disnomia",
    description: "Microservicio API para calificación de ejercicios educativos.",
    role: "Motor de evaluación",
    stack: ["NestJS"],
  },
];
```

- [ ] **Step 2: Crear `src/components/ProjectCard.astro`**

```astro
---
interface Props {
  name: string;
  description: string;
  role: string;
  stack: string[];
}
const { name, description, role, stack } = Astro.props;
---
<article class="card">
  <h3>{name}</h3>
  <p class="card-desc">{description}</p>
  <p class="card-role"><span class="label">ROL:</span> {role}</p>
  <div class="card-stack">
    {stack.map((tech) => <span class="tag">{tech}</span>)}
  </div>
</article>

<style>
.card {
  border: 1px solid var(--color-border);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  background: var(--color-bg-elevated);
}
.card h3 { font-size: 1.1rem; }
.card-desc { color: var(--color-text-muted); font-size: 0.9rem; flex-grow: 1; }
.card-role { font-size: 0.85rem; color: var(--color-text-muted); }
.label { font-family: var(--font-mono); color: var(--color-accent); }
.card-stack { display: flex; flex-wrap: wrap; gap: var(--space-1); margin-top: var(--space-1); }
</style>
```

- [ ] **Step 3: Crear `src/components/Projects.astro`**

```astro
---
import ProjectCard from './ProjectCard.astro';
import { projects } from '../data/projects';
---
<section id="projects" class="section">
  <div class="container">
    <p class="section-title">[ 03 ] Proyectos</p>
    <div class="projects-grid">
      {projects.map((project) => (
        <ProjectCard
          name={project.name}
          description={project.description}
          role={project.role}
          stack={project.stack}
        />
      ))}
    </div>
  </div>
</section>

<style>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-3);
}
</style>
```

- [ ] **Step 4: Actualizar `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Experience from '../components/Experience.astro';
import Projects from '../components/Projects.astro';
---
<BaseLayout
  title="Mateo Miño — Ciberseguridad, Inteligencia y OSINT"
  description="Portafolio de Mateo Miño: Tech Lead & Seguridad Digital, autor de herramientas de ciberinteligencia e investigación OSINT."
>
  <Hero />
  <About />
  <Experience />
  <Projects />
</BaseLayout>
```

- [ ] **Step 5: Verificar que los 5 proyectos están presentes**

Run: `npm run build && for p in Intellify Docentra WordyGo "Jonezer App" Disnomia; do grep -q "$p" dist/index.html && echo "OK: $p" || echo "FALTA: $p"; done`
Expected: imprime `OK: <nombre>` para los 5 proyectos, ningún `FALTA`.

- [ ] **Step 6: Commit**

```bash
git add src/data/projects.ts src/components/ProjectCard.astro src/components/Projects.astro src/pages/index.astro
git commit -m "feat: add projects data and projects section"
```

---

### Task 8: Sección eCondor Digital (empresa)

**Files:**
- Create: `src/components/Company.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear `src/components/Company.astro`**

```astro
---
---
<section id="company" class="section">
  <div class="container company">
    <p class="section-title">[ 04 ] eCondor Digital</p>
    <h3>Software minimalista y moderno</h3>
    <p class="company-desc">
      eCondor Digital es la empresa donde lidero la parte técnica y de
      seguridad digital. Construimos productos web y mobile con foco en
      velocidad, medición y escalabilidad: desarrollo web, apps móviles,
      backend & APIs, UI/UX, consultoría tech y MVPs.
    </p>
    <a class="btn" href="https://econdordigital.org/" target="_blank" rel="noopener">econdordigital.org</a>
  </div>
</section>

<style>
.company-desc { color: var(--color-text-muted); max-width: 600px; margin-bottom: var(--space-3); }
</style>
```

- [ ] **Step 2: Actualizar `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Experience from '../components/Experience.astro';
import Projects from '../components/Projects.astro';
import Company from '../components/Company.astro';
---
<BaseLayout
  title="Mateo Miño — Ciberseguridad, Inteligencia y OSINT"
  description="Portafolio de Mateo Miño: Tech Lead & Seguridad Digital, autor de herramientas de ciberinteligencia e investigación OSINT."
>
  <Hero />
  <About />
  <Experience />
  <Projects />
  <Company />
</BaseLayout>
```

- [ ] **Step 3: Verificar la ortografía exacta de "eCondor Digital"**

Run: `npm run build && grep -o "eCondor Digital" dist/index.html | sort -u`
Expected: imprime únicamente `eCondor Digital` (sin tilde, sin variantes como "Econdor" o "eCóndor").

- [ ] **Step 4: Commit**

```bash
git add src/components/Company.astro src/pages/index.astro
git commit -m "feat: add eCondor Digital company section"
```

---

### Task 9: Sección Contacto

**Files:**
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear `src/components/Contact.astro`**

```astro
---
---
<section id="contact" class="section">
  <div class="container">
    <p class="section-title">[ 05 ] Contacto</p>
    <form class="contact-form" method="GET" action="mailto:mateo.mino@epn.edu.ec" enctype="text/plain">
      <input type="text" name="name" placeholder="Tu nombre" required />
      <input type="email" name="email" placeholder="Tu email" required />
      <textarea name="message" placeholder="Tu mensaje" rows="5" required></textarea>
      <button type="submit" class="btn">Enviar</button>
    </form>
  </div>
</section>

<style>
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 480px;
}
.contact-form input,
.contact-form textarea {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.6rem;
  font-family: var(--font-sans);
}
.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}
.contact-form button { align-self: flex-start; }
</style>
```

- [ ] **Step 2: Actualizar `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Experience from '../components/Experience.astro';
import Projects from '../components/Projects.astro';
import Company from '../components/Company.astro';
import Contact from '../components/Contact.astro';
---
<BaseLayout
  title="Mateo Miño — Ciberseguridad, Inteligencia y OSINT"
  description="Portafolio de Mateo Miño: Tech Lead & Seguridad Digital, autor de herramientas de ciberinteligencia e investigación OSINT."
>
  <Hero />
  <About />
  <Experience />
  <Projects />
  <Company />
  <Contact />
</BaseLayout>
```

- [ ] **Step 3: Verificar validación HTML del formulario**

Run: `npm run build && grep -o 'type="email"' dist/index.html && grep -c "required" dist/index.html`
Expected: encuentra `type="email"` y un conteo de al menos 3 (`name`, `email`, `message` son `required`).

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.astro src/pages/index.astro
git commit -m "feat: add contact section"
```

---

### Task 10: Footer

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear `src/components/Footer.astro`**

```astro
---
const socials = [
  { href: "https://github.com/Mino-Mateo", label: "GitHub" },
  { href: "https://www.linkedin.com/in/mateo-miño/", label: "LinkedIn" },
  { href: "https://www.youtube.com/@mateomino-vc4hl", label: "YouTube" },
];
---
<footer class="footer">
  <div class="container footer-inner">
    <ul class="footer-links">
      {socials.map((s) => (
        <li><a href={s.href} target="_blank" rel="noopener">{s.label}</a></li>
      ))}
    </ul>
    <a href="#home" class="back-to-top">↑ Volver arriba</a>
  </div>
</footer>

<style>
.footer { padding: var(--space-4) 0; }
.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.footer-links {
  list-style: none;
  display: flex;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}
.footer-links a { color: var(--color-text-muted) !important; text-decoration: none !important; }
.footer-links a:hover { color: var(--color-accent) !important; }
.back-to-top { font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-text-muted) !important; text-decoration: none !important; }
</style>
```

- [ ] **Step 2: Actualizar `src/pages/index.astro` (versión final)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Experience from '../components/Experience.astro';
import Projects from '../components/Projects.astro';
import Company from '../components/Company.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout
  title="Mateo Miño — Ciberseguridad, Inteligencia y OSINT"
  description="Portafolio de Mateo Miño: Tech Lead & Seguridad Digital, autor de herramientas de ciberinteligencia e investigación OSINT."
>
  <Hero />
  <About />
  <Experience />
  <Projects />
  <Company />
  <Contact />
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Verificar**

Run: `npm run build && grep -o "github.com/Mino-Mateo" dist/index.html | head -1`
Expected: encuentra coincidencia.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add footer section"
```

---

### Task 11: Migrar assets y eliminar la plantilla legacy

**Files:**
- Create: `public/favicon.png` (movido desde `images/favicon/icons8-squiggly-line-stickers-96.png`)
- Delete: `index.html`, `css/`, `js/`, `images/`

- [ ] **Step 1: Mover el favicon a `public/`**

```bash
mkdir -p public
git mv images/favicon/icons8-squiggly-line-stickers-96.png public/favicon.png
```

- [ ] **Step 2: Eliminar la plantilla legacy (ya reemplazada por el sitio Astro)**

```bash
git rm index.html
git rm -r css js
git rm -r images
```

- [ ] **Step 3: Verificar que el build sigue funcionando sin la plantilla vieja**

Run: `npm run build && test -f dist/index.html && echo "BUILD OK"`
Expected: imprime `BUILD OK`.

- [ ] **Step 4: Verificar que el favicon se sirve correctamente**

Run: `grep -o 'href="/favicon.png"' dist/index.html`
Expected: encuentra coincidencia.

- [ ] **Step 5: Commit**

```bash
git add public/favicon.png
git commit -m "chore: migrate favicon and remove legacy Bootstrap/jQuery template"
```

---

### Task 12: Despliegue en GitHub Pages y verificación final

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Crear el workflow de despliegue**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verificación final completa — build + arranque + contenido**

Run:
```bash
npm run build
npm run preview &
PREVIEW_PID=$!
sleep 2
curl -s http://localhost:4321/ -o /tmp/portfolio-check.html
kill $PREVIEW_PID
grep -o "Mateo Miño" /tmp/portfolio-check.html | head -1
grep -o "eCondor Digital" /tmp/portfolio-check.html | sort -u
for p in Intellify Docentra WordyGo "Jonezer App" Disnomia; do grep -q "$p" /tmp/portfolio-check.html && echo "OK: $p"; done
```
Expected: el servidor responde 200, aparece `Mateo Miño`, `eCondor Digital` (sin variantes), y los 5 proyectos con `OK: <nombre>`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deploy workflow"
```

- [ ] **Step 4: Paso manual (no automatizable) — informar al usuario**

Después de hacer push, el usuario debe ir a **Settings → Pages** del repositorio en GitHub y cambiar "Source" de "Deploy from a branch" a **"GitHub Actions"**. Esto es un cambio de configuración en la UI de GitHub que no se puede hacer desde el código del repo.

---

## Notas finales

- El color de acento (`#4fd1c5`, cian apagado) fue una decisión tomada en este plan porque la spec dejaba dos opciones abiertas; si no convence en la revisión visual final, es un único valor CSS (`--color-accent` en `src/styles/global.css`) fácil de cambiar.
- Ningún proyecto tiene link público confirmado, así que las tarjetas no incluyen CTA de "ver proyecto" — coincide con la spec.
- El formulario de contacto usa el truco `mailto:` + `enctype="text/plain"` (abre el cliente de correo del visitante) porque no hay backend ni servicio de envío definido — está marcado como "placeholder" en la spec.
