/**
 * PROFILES SERVICE - Simulación de perfiles y matching (MOCK)
 * Reemplaza las rutas /perfil, /Users/match, /Users/match/check de Flask
 */

import type { Profile, Match, UpdateProfileData } from '@/types';

// Base de datos mock de perfiles
const mockProfiles: Match[] = [
  {
    user_id: 'user-001',
    username: 'marialopez',
    nombre: 'María',
    apellido: 'López',
    edad: 22,
    genero: 'F',
    descripcion: 'Amante del arte y los viajes. Buscando conexiones genuinas.',
    ruta_photo: undefined,
  },
  {
    user_id: 'user-002',
    username: 'juanperez',
    nombre: 'Juan',
    apellido: 'Pérez',
    edad: 25,
    genero: 'M',
    descripcion: 'Deportista y cocinero amateur. Me encanta la aventura.',
    ruta_photo: undefined,
  },
  {
    user_id: 'user-003',
    username: 'sofiagarcia',
    nombre: 'Sofía',
    apellido: 'García',
    edad: 21,
    genero: 'F',
    descripcion: 'Estudiante de medicina. Amo los gatos y el café.',
    ruta_photo: undefined,
  },
  {
    user_id: 'user-004',
    username: 'carlosrodriguez',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    edad: 28,
    genero: 'M',
    descripcion: 'Ingeniero de software. Gamer y cinéfilo empedernido.',
    ruta_photo: undefined,
  },
  {
    user_id: 'user-005',
    username: 'anamartinez',
    nombre: 'Ana',
    apellido: 'Martínez',
    edad: 23,
    genero: 'F',
    descripcion: 'Fotógrafa freelance. Explorando el mundo una foto a la vez.',
    ruta_photo: undefined,
  },
];

let currentProfileIndex = 0;
const likedUsers = new Set<string>();
const matchedUsers = new Set<string>();

export async function getProfile(userId: string): Promise<Profile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        username: 'cesarperales',
        nombre: 'Cesar',
        apellido: 'Perales',
        nacimiento: '2005-05-20',
        edad: 19,
        genero: 'M',
        descripcion: 'Guapo por naturaleza, con propietaria pero sin dueña.',
        ruta_photo: undefined,
      });
    }, 300);
  });
}

export async function getRandomMatch(): Promise<Match> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const profile = mockProfiles[currentProfileIndex % mockProfiles.length];
      currentProfileIndex++;
      resolve(profile);
    }, 300);
  });
}

export async function checkMatch(userId: string): Promise<{ success: boolean; match: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      likedUsers.add(userId);
      
      // Simula match cada 3 likes
      const isMatch = likedUsers.size % 3 === 0;
      
      if (isMatch) {
        matchedUsers.add(userId);
      }
      
      resolve({ success: true, match: isMatch });
    }, 400);
  });
}

export async function updateProfile(data: UpdateProfileData): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}

export async function uploadProfilePhoto(file: File): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 800);
  });
}

export function getMatchedUsers(): string[] {
  return Array.from(matchedUsers);
}
