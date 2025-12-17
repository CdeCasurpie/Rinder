/**
 * TYPES - Tipos extraídos del modelo Flask original
 */

export interface User {
  id_usuario: string;
  username: string;
  correo: string;
  active: boolean;
  likes_restantes: number;
}

export interface Profile {
  id?: string; // auth.users.id en Supabase
  username: string;
  nombre: string;
  apellido: string;
  nacimiento: string; // ISO date string
  edad: number;
  genero?: string;
  descripcion?: string;
  ruta_photo?: string;
  created_at?: string;
  modified_at?: string;
}

export interface Match {
  user_id: string;
  username: string;
  nombre: string;
  apellido: string;
  edad: number;
  genero?: string;
  descripcion?: string;
  ruta_photo?: string;
}

export interface Chat {
  id_chat: string;
  id_usuario: string;
  id_usuario2: string;
  id_mensaje: string;
  fecha: string;
  otherUser?: Profile & { other_id: string };
  lastMessage?: Message;
}

export interface Message {
  id_mensaje: string;
  id_usuarioremitente?: string;
  id_chat: string;
  id_mensajePadre?: string;
  fecha: string;
  contenido: string;
  state?: string;
  formato?: string;
  propietario?: number; // 1 = yo, -1 = otro, 0 = servidor
}

export interface LoginCredentials {
  email_login: string;
  password_login: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  username: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  name?: string;
  lastname?: string;
  description?: string;
}
