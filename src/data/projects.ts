import type { ImageMetadata } from "astro";
import intellifyImage from "../assets/images/projects/intellify.jpeg";
import docentraImage from "../assets/images/projects/docentra.png";
import wordygoImage from "../assets/images/projects/wordygo.png";
import jonezerImage from "../assets/images/projects/jonezer.jpeg";
import disnomiaImage from "../assets/images/projects/disnomia.png";
import geoquitoImage from "../assets/images/projects/geoquito.png";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  name: string;
  description: string;
  role: string;
  stack: string[];
  area: "osint" | "desarrollo";
  image?: ImageMetadata;
  /** "upper": recorte centrado al 22% para capturas verticales (por defecto "top") */
  imagePosition?: "upper";
  links?: ProjectLink[];
}

// Orden dentro de cada área = orden en la página (las cards sin imagen van juntas en la misma fila)
export const projects: Project[] = [
  {
    name: "Intellify",
    description:
      "Sistema de ciberinteligencia para indexación de información, creación de fichas OSINT e investigación.",
    role: "Autoría completa",
    stack: ["React", "Python", "SQL"],
    area: "osint",
    image: intellifyImage,
  },
  {
    name: "Sistema GeoQuito",
    description:
      "Visor geográfico predial mejorado sobre el geoportal municipal: mejores rutas, más información por predio y consulta interactiva.",
    role: "Autoría completa",
    stack: ["Python", "Leaflet", "ArcGIS REST API"],
    area: "osint",
    image: geoquitoImage,
    links: [{ label: "Probar demo", href: "#demo-geoquito" }],
  },
  {
    name: "Spectra",
    description:
      "Crawler OSINT que descubre endpoints, enlaces y datos expuestos de un objetivo, con interfaz clara y reportes.",
    role: "Diseño y desarrollo (repositorio privado)",
    stack: [],
    area: "osint",
  },
  {
    name: "Verificador de identificación",
    description:
      "Validación de números de identificación de Ecuador, Chile, México y Brasil. Corre en el navegador, sin enviar datos.",
    role: "Autoría completa",
    stack: ["Python", "TypeScript", "CSS", "HTML"],
    area: "osint",
    links: [
      { label: "Código", href: "https://github.com/Mino-Mateo/Verificador-de-C-dula" },
      { label: "Probar demo", href: "#demo-cedula" },
    ],
  },
  {
    name: "Docentra",
    description: "Sistema de evaluación docente y gestión académica.",
    role: "Backend, cálculos, base de datos",
    stack: ["React", "Bun", "PostgreSQL", ".NET"],
    area: "desarrollo",
    image: docentraImage,
  },
  {
    name: "WordyGo",
    description:
      "Sistema multirol de ejercicios de inglés, hecho para Salazar Editores.",
    role: "Backend, base de datos, sistemas de seguridad",
    stack: ["React", "Supabase", "NestJS"],
    area: "desarrollo",
    image: wordygoImage,
  },
  {
    name: "Jonezer App",
    description:
      "Aplicación móvil de gestión comercial: clientes, ventas y productos.",
    role: "Funcionalidades de cálculo y roles",
    stack: ["Flutter"],
    area: "desarrollo",
    image: jonezerImage,
    // Captura vertical: centra el saludo y la card principal en el recorte 2:1
    imagePosition: "upper",
  },
  {
    name: "Disnomia",
    description: "Microservicio API para calificación de ejercicios educativos.",
    role: "Motor de evaluación",
    stack: ["NestJS"],
    area: "desarrollo",
    image: disnomiaImage,
  },
];
