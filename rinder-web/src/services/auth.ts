/**
 * AUTH SERVICE - Simulación de autenticación (MOCK)
 * Reemplaza las rutas /login, /register, /logout de Flask
 */

import type { LoginCredentials, RegisterData, User, Profile } from '@/types';

const AUTH_STORAGE_KEY = 'rinder_current_user';

// Función para obtener el usuario del localStorage
function getUserFromStorage(): (User & Profile) | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Función para guardar el usuario en localStorage
function saveUserToStorage(user: (User & Profile) | null): void {
  if (typeof window === 'undefined') return;
  
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export async function login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula validación (siempre exitosa en mock)
      if (credentials.email_login && credentials.password_login) {
        const user: User & Profile = {
          id_usuario: 'mock-user-id-123',
          username: 'cesarperales',
          correo: credentials.email_login,
          active: true,
          likes_restantes: 10,
          nombre: 'Cesar',
          apellido: 'Perales',
          nacimiento: '2005-05-20',
          edad: 19,
          genero: 'M',
          descripcion: 'Guapo por naturaleza, con propietaria pero sin dueña. Cesitar es libre, cesitar es amor.',
          ruta_photo: undefined,
        };
        
        saveUserToStorage(user);
        resolve({ success: true });
      } else {
        resolve({ success: false, message: 'Credenciales incorrectas' });
      }
    }, 500);
  });
}

export async function register(data: RegisterData): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula registro exitoso
      const user: User & Profile = {
        id_usuario: `mock-${Date.now()}`,
        username: data.username,
        correo: data.email,
        active: true,
        likes_restantes: 10,
        nombre: data.nombre,
        apellido: data.apellido,
        nacimiento: data.fecha_nacimiento,
        edad: calcularEdad(data.fecha_nacimiento),
        genero: undefined,
        descripcion: undefined,
        ruta_photo: undefined,
      };
      
      saveUserToStorage(user);
      resolve({ success: true });
    }, 500);
  });
}

export async function logout(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      saveUserToStorage(null);
      resolve();
    }, 200);
  });
}

export async function getCurrentUser(): Promise<(User & Profile) | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getUserFromStorage());
    }, 100);
  });
}

export function isAuthenticated(): boolean {
  return getUserFromStorage() !== null;
}

// Helper
function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
