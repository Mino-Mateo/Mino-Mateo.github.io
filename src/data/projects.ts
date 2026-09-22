import type { ImageMetadata } from "astro";
import intellifyImage from "../assets/images/projects/intellify.jpeg";
import docentraImage from "../assets/images/projects/docentra.png";
import wordygoImage from "../assets/images/projects/wordygo.png";
import jonezerImage from "../assets/images/projects/jonezer.jpeg";
import disnomiaImage from "../assets/images/projects/disnomia.png";

export interface Project {
  name: string;
  description: string;
  role: string;
  stack: string[];
  image: ImageMetadata;
}

export const projects: Project[] = [
  {
    name: "Intellify",
    description:
      "Sistema de ciberinteligencia para indexación de información, creación de fichas OSINT e investigación.",
    role: "Autoría completa",
    stack: ["React", "Python", "SQL"],
    image: intellifyImage,
  },
  {
    name: "Docentra",
    description: "Sistema de evaluación docente y gestión académica.",
    role: "Backend, cálculos, base de datos",
    stack: ["React", "Bun", "PostgreSQL", ".NET"],
    image: docentraImage,
  },
  {
    name: "WordyGo",
    description:
      "Sistema multirol de ejercicios de inglés, hecho para Salazar Editores.",
    role: "Backend, base de datos, sistemas de seguridad",
    stack: ["React", "Supabase", "NestJS"],
    image: wordygoImage,
  },
  {
    name: "Jonezer App",
    description:
      "Aplicación móvil de gestión comercial: clientes, ventas y productos.",
    role: "Funcionalidades de cálculo y roles",
    stack: ["Flutter"],
    image: jonezerImage,
  },
  {
    name: "Disnomia",
    description: "Microservicio API para calificación de ejercicios educativos.",
    role: "Motor de evaluación",
    stack: ["NestJS"],
    image: disnomiaImage,
  },
];
