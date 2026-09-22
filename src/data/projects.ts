export interface Project {
  name: string;
  description: string;
  role: string;
  stack: string[];
  image: string;
}

export const projects: Project[] = [
  {
    name: "Intellify",
    description:
      "Sistema de ciberinteligencia para indexación de información, creación de fichas OSINT e investigación.",
    role: "Autoría completa",
    stack: ["React", "Python", "SQL"],
    image: "/images/projects/intellify.jpeg",
  },
  {
    name: "Docentra",
    description: "Sistema de evaluación docente y gestión académica.",
    role: "Backend, cálculos, base de datos",
    stack: ["React", "Bun", "PostgreSQL", ".NET"],
    image: "/images/projects/docentra.png",
  },
  {
    name: "WordyGo",
    description:
      "Sistema multirol de ejercicios de inglés, hecho para Salazar Editores.",
    role: "Backend, base de datos, sistemas de seguridad",
    stack: ["React", "Supabase", "NestJS"],
    image: "/images/projects/wordygo.png",
  },
  {
    name: "Jonezer App",
    description:
      "Aplicación móvil de gestión comercial: clientes, ventas y productos.",
    role: "Funcionalidades de cálculo y roles",
    stack: ["Flutter"],
    image: "/images/projects/jonezer.jpeg",
  },
  {
    name: "Disnomia",
    description: "Microservicio API para calificación de ejercicios educativos.",
    role: "Motor de evaluación",
    stack: ["NestJS"],
    image: "/images/projects/disnomia.png",
  },
];
