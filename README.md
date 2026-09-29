# mino-mateo.github.io

Portafolio de **Mateo Miño**: Tech Lead, seguridad digital e inteligencia OSINT.

Sitio en vivo: https://mino-mateo.github.io

## Qué incluye

- Proyectos de inteligencia OSINT, seguridad y desarrollo.
- Demos que corren en el navegador: verificador de documentos de identidad (Ecuador, Chile, México, Brasil) y consulta predial sobre el geoportal público de Quito.

## Stack y decisiones

- Astro 4 como sitio estático, publicado en GitHub Pages. `npm run build` corre `astro check` antes de compilar, así que el CI falla ante errores de tipos.
- Sistema de diseño en `design.md`, con los tokens en `src/styles/global.css`.
- Accesibilidad revisada contra WCAG 2.2 AA (Lighthouse 100 en accesibilidad, buenas prácticas y SEO), con soporte de `prefers-reduced-motion` y alto contraste.
- Sin analítica. Tipografía autoalojada y iconos Lucide renderizados en el build, sin JavaScript extra en el navegador.
- Imágenes optimizadas con `astro:assets` (webp y `srcset`).

## Correr en local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build en dist/
```

## Estructura

- `src/components/`: secciones del sitio y demos (`tools/`).
- `src/data/projects.ts`: datos de los proyectos.
- `src/lib/validators/`: algoritmos de validación de documentos por país.
- `public/`: favicon y fuentes (JetBrains Mono, licencia OFL).
