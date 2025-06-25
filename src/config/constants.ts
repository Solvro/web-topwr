import type { Department } from "@/lib/types";

export const SOLVRO_WEBPAGE_URL = "https://solvro.pwr.edu.pl/pl/";

export const API_URL = process.env.API_URL ?? "https://api.topwr.solvro.pl";

export const UNIVERSITY_DEPARTMENTS: Department[] = [
  {
    id: 1,
    name: "Wydział Architektury",
  },
  {
    id: 2,
    name: "Wydział Budownictwa Lądowego i Wodnego",
  },
  {
    id: 4,
    name: "Wydział Chemiczny",
  },
  {
    id: 5,
    name: "Wydział Informatyki i Telekomunikacji",
  },
  {
    id: 6,
    name: "Wydział Elektryczny",
  },
  {
    id: 7,
    name: "Wydział Geoinżynierii, Górnictwa i Geologii",
  },
  {
    id: 8,
    name: "Wydział Inżynierii Środowiska",
  },
  {
    id: 9,
    name: "Wydział Zarządzania",
  },
  {
    id: 10,
    name: "Wydział Mechaniczno-Energetyczny",
  },
  {
    id: 11,
    name: "Wydział Mechaniczny",
  },
  {
    id: 12,
    name: "Wydział Podstawowych Problemów Techniki",
  },
  {
    id: 13,
    name: "Wydział Elektroniki, Fotoniki i Mikrosystemów",
  },
  {
    id: 14,
    name: "Wydział Matematyki",
  },
  {
    id: 15,
    name: "Wydział Medyczny",
  },
];
