/**
 * MESSAGES SERVICE - Simulación de mensajería (MOCK)
 * Reemplaza las rutas /mensajes/list, /Mensajes de Flask
 */

import type { Chat, Message } from '@/types';

// Base de datos mock de chats
const mockChats: Chat[] = [
  {
    id_chat: 'chat-001',
    id_usuario: 'mock-user-id-123',
    id_usuario2: 'user-001',
    id_mensaje: 'msg-001-last',
    fecha: new Date().toISOString(),
    otherUser: {
      id: 'user-001',
      username: 'marialopez',
      nombre: 'María',
      apellido: 'López',
      edad: 22,
      genero: 'F',
      descripcion: 'Amante del arte y los viajes.',
      nacimiento: '2002-03-15',
      ruta_photo: undefined,
      other_id: 'user-001',
    },
    lastMessage: {
      id_mensaje: 'msg-001-last',
      id_usuarioremitente: 'user-001',
      id_chat: 'chat-001',
      contenido: '¡Hola! ¿Cómo estás?',
      fecha: new Date().toISOString(),
    },
  },
  {
    id_chat: 'chat-002',
    id_usuario: 'mock-user-id-123',
    id_usuario2: 'user-002',
    id_mensaje: 'msg-002-last',
    fecha: new Date(Date.now() - 3600000).toISOString(),
    otherUser: {
      id: 'user-002',
      username: 'juanperez',
      nombre: 'Juan',
      apellido: 'Pérez',
      edad: 25,
      genero: 'M',
      descripcion: 'Deportista y cocinero amateur.',
      nacimiento: '1999-07-20',
      ruta_photo: undefined,
      other_id: 'user-002',
    },
    lastMessage: {
      id_mensaje: 'msg-002-last',
      id_usuarioremitente: 'mock-user-id-123',
      id_chat: 'chat-002',
      contenido: 'Nos vemos pronto!',
      fecha: new Date(Date.now() - 3600000).toISOString(),
    },
  },
];

// Almacenamiento de mensajes por chat
const chatMessages: Record<string, Message[]> = {
  'chat-001': [
    {
      id_mensaje: 'msg-001-1',
      id_usuarioremitente: undefined,
      id_chat: 'chat-001',
      contenido: 'Has matcheado!',
      fecha: new Date(Date.now() - 86400000).toISOString(),
      propietario: 0,
    },
    {
      id_mensaje: 'msg-001-2',
      id_usuarioremitente: 'user-001',
      id_chat: 'chat-001',
      contenido: '¡Hola! Me encantó tu perfil',
      fecha: new Date(Date.now() - 7200000).toISOString(),
      propietario: -1,
    },
    {
      id_mensaje: 'msg-001-3',
      id_usuarioremitente: 'mock-user-id-123',
      id_chat: 'chat-001',
      contenido: 'Gracias! El tuyo también es genial',
      fecha: new Date(Date.now() - 3600000).toISOString(),
      propietario: 1,
    },
    {
      id_mensaje: 'msg-001-last',
      id_usuarioremitente: 'user-001',
      id_chat: 'chat-001',
      contenido: '¡Hola! ¿Cómo estás?',
      fecha: new Date().toISOString(),
      propietario: -1,
    },
  ],
  'chat-002': [
    {
      id_mensaje: 'msg-002-1',
      id_usuarioremitente: undefined,
      id_chat: 'chat-002',
      contenido: 'Has matcheado!',
      fecha: new Date(Date.now() - 172800000).toISOString(),
      propietario: 0,
    },
    {
      id_mensaje: 'msg-002-2',
      id_usuarioremitente: 'mock-user-id-123',
      id_chat: 'chat-002',
      contenido: '¿Qué tal?',
      fecha: new Date(Date.now() - 86400000).toISOString(),
      propietario: 1,
    },
    {
      id_mensaje: 'msg-002-last',
      id_usuarioremitente: 'mock-user-id-123',
      id_chat: 'chat-002',
      contenido: 'Nos vemos pronto!',
      fecha: new Date(Date.now() - 3600000).toISOString(),
      propietario: 1,
    },
  ],
};

export async function getChatsList(): Promise<Chat[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockChats);
    }, 300);
  });
}

export async function getMessages(lastMessageId: string): Promise<Message[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Buscar el chat que contiene este mensaje
      const chat = mockChats.find((c) => c.id_mensaje === lastMessageId);
      if (chat && chatMessages[chat.id_chat]) {
        resolve(chatMessages[chat.id_chat]);
      } else {
        resolve([]);
      }
    }, 300);
  });
}

export async function sendMessage(chatId: string, content: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        id_mensaje: `msg-${Date.now()}`,
        id_usuarioremitente: 'mock-user-id-123',
        id_chat: chatId,
        contenido: content,
        fecha: new Date().toISOString(),
        propietario: 1,
      };

      // Agregar mensaje al chat correspondiente
      if (chatMessages[chatId]) {
        chatMessages[chatId].push(newMessage);
      }

      // Actualizar último mensaje del chat
      const chat = mockChats.find((c) => c.id_chat === chatId);
      if (chat && chat.lastMessage) {
        chat.lastMessage = newMessage;
        chat.id_mensaje = newMessage.id_mensaje;
      }

      resolve({ success: true });
    }, 400);
  });
}
