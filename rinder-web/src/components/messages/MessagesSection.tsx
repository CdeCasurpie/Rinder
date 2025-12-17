"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getChatsList, getMessages, sendMessage } from '@/services/messages';
import type { Chat, Message } from '@/types';
import { getAssetPath } from '@/lib/utils';

export default function MessagesSection() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadChats = async () => {
    const chatsList = await getChatsList();
    setChats(chatsList);
  };

  const handleChatClick = async (chat: Chat) => {
    setActiveChat(chat);
    if (chat.id_mensaje) {
      const msgs = await getMessages(chat.id_mensaje);
      setMessages(msgs);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeChat || !newMessage.trim()) return;

    await sendMessage(activeChat.id_chat, newMessage);
    
    // Agregar mensaje localmente
    const newMsg: Message = {
      id_mensaje: `temp-${Date.now()}`,
      id_usuarioremitente: 'mock-user-id-123',
      id_chat: activeChat.id_chat,
      contenido: newMessage,
      fecha: new Date().toISOString(),
      propietario: 1,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(e as any);
    }
  };

  return (
    <>
      {/* LEFT: Lista de contactos */}
      <div className="left-Messages-container">
        <h3>Mensajes</h3>
        <div className="messages-list-container" id="messages-list-container">
          {chats.length === 0 ? (
            <div id="show_chats">Aca se van a mostrar tus chats!</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id_chat}
                className={`contact-box ${activeChat?.id_chat === chat.id_chat ? 'contact-box-active' : ''}`}
                data-id={chat.id_mensaje}
                data-chat-id={chat.id_chat}
                onClick={() => handleChatClick(chat)}
                style={{ cursor: 'pointer' }}
              >
                <div className="contact-box-immage">
                  <Image
                    src={
                      chat.otherUser?.ruta_photo
                        ? getAssetPath(`/assets/profilePhotos/${chat.otherUser.other_id}/${chat.otherUser.ruta_photo}`)
                        : getAssetPath('/assets/images/fondo1.JPG')
                    }
                    alt="Foto de perfil"
                    width={60}
                    height={60}
                  />
                </div>
                <div className="contact-box-message">
                  <p><strong>{chat.otherUser?.username || 'Usuario'}</strong></p>
                  <p>{chat.lastMessage?.contenido || 'Sin mensajes'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Conversación activa */}
      <div className="right-Messages-container">
        <div id="main-Messages-container" className="main-Messages-container">
          {activeChat && activeChat.otherUser && (
            <div className="user-Message-info">
              <Image
                src={
                  activeChat.otherUser.ruta_photo
                    ? getAssetPath(`/assets/profilePhotos/${activeChat.otherUser.other_id}/${activeChat.otherUser.ruta_photo}`)
                    : getAssetPath('/assets/images/fondo1.JPG')
                }
                alt="Foto de perfil"
                width={150}
                height={150}
              />
              <h4>{activeChat.otherUser.nombre} {activeChat.otherUser.apellido}</h4>
              <p><strong>Descripción: </strong>{activeChat.otherUser.descripcion || 'Sin descripción'}</p>
            </div>
          )}
          
          <div className="user-Message-box" id="user-Message-box">
            {messages.map((msg) => (
              <div
                key={msg.id_mensaje}
                className={`user-Message ${
                  msg.propietario === 0
                    ? 'server-Message'
                    : msg.propietario === 1
                    ? 'this-Message'
                    : 'other-Message'
                }`}
              >
                <p>{msg.contenido}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="send-Messages-container">
          <button id="emoji-btn" className="emoji-btn" style={{ display: 'none' }}>
            🧐
          </button>
          <input
            type="text"
            placeholder="Escribe un mensaje"
            id="mensaje_value"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button id="send-btn" className="send-btn" onClick={handleSendMessage}>
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}
