import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mino-mateo.github.io',
  // Sin bloques de código: Shiki no es compatible con la CSP y solo generaría un aviso
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://services.arcgisonline.com",
        // GeoQuito, más la ficha de dominio: DNS, Wayback y la lista fija de RDAP de src/lib/dominio.ts
        "connect-src 'self' https://geocode.arcgis.com https://geoquito.quito.gob.ec https://dns.google https://archive.org https://rdap.verisign.com https://rdap.publicinterestregistry.org https://rdap.registry.ec https://pubapi.registry.google https://rdap.registro.br https://rdap.nic.ar",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
      ],
      scriptDirective: {
        // <script is:inline> de BaseLayout que añade la clase 'js' (Astro no hashea is:inline).
        // Si cambia un carácter: printf "%s" "<código>" | openssl dgst -sha256 -binary | base64
        hashes: ['sha256-/x7W7R75k8Roq0WaVRQX9blP4OufE5xbAdzklGxsgpw='],
      },
    },
  },
});
