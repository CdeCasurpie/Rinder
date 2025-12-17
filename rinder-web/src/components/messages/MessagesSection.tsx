"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getChatsList, getMessages, sendMessage } from '@/services/messages';
import { getAssetPath } from '@/lib/utils';
import type { Chat, Message } from '@/types';

export default function MessagesSection() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

    setIsTyping(true);
    await sendMessage(activeChat.id_chat, newMessage);
    
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
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* LEFT SIDEBAR - Lista de Chats */}
      <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Mensajes</h2>
          <p className="text-sm text-gray-500">
            {chats.length} {chats.length === 1 ? 'conversación' : 'conversaciones'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar conversación..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sin conversaciones aún</h3>
              <p className="text-sm text-gray-500">Cuando hagas match con alguien, podrás chatear aquí</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {chats.map((chat) => {
                const isActive = activeChat?.id_chat === chat.id_chat;
                return (
                  <div
                    key={chat.id_chat}
                    onClick={() => handleChatClick(chat)}
                    className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      isActive ? 'bg-pink-50 border-l-4 border-pink-500' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                        <Image
                          src={
                            chat.otherUser?.ruta_photo
                              ? getAssetPath(`/assets/profilePhotos/${chat.otherUser.other_id}/${chat.otherUser.ruta_photo}`)
                              : getAssetPath('/assets/images/fondo1.JPG')
                          }
                          alt={chat.otherUser?.username || 'Usuario'}
                          width={56}
                          height={56}
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {chat.otherUser?.nombre || 'Usuario'} {chat.otherUser?.apellido || ''}
                        </h4>
                        <span className="text-xs text-gray-500 shrink-0 ml-2">
                          {formatTime(chat.lastMessage?.fecha || chat.fecha)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage?.propietario === 1 && (
                          <span className="text-gray-400 mr-1">Tú:</span>
                        )}
                        {chat.lastMessage?.contenido || 'Sin mensajes'}
                      </p>
                    </div>

                    {!isActive && Math.random() > 0.5 && (
                      <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-xs text-white font-semibold">2</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CONTENT - Conversación */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-16 h-16 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Selecciona una conversación</h2>
            <p className="text-gray-500 max-w-md">
              Elige un chat de la izquierda para comenzar a hablar con tus matches
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-pink-100">
                      <Image
                        src={
                          activeChat.otherUser?.ruta_photo
                            ? getAssetPath(`/assets/profilePhotos/${activeChat.otherUser.other_id}/${activeChat.otherUser.ruta_photo}`)
                            : getAssetPath('/assets/images/fondo1.JPG')
                        }
                        alt="Foto de perfil"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {activeChat.otherUser?.nombre} {activeChat.otherUser?.apellido}
                    </h3>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      En línea
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {activeChat.otherUser?.descripcion && (
                <div className="mt-3 text-sm text-gray-600 bg-pink-50 px-4 py-2 rounded-lg">
                  <span className="font-medium text-pink-700">Sobre {activeChat.otherUser.nombre}:</span>{' '}
                  {activeChat.otherUser.descripcion}
                </div>
              )}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.map((msg, index) => {
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].fecha) !== formatDate(msg.fecha);

                return (
                  <div key={msg.id_mensaje}>
                    {showDate && (
                      <div className="flex items-center justify-center my-6">
                        <div className="bg-gray-200 text-gray-600 text-xs font-medium px-4 py-1 rounded-full">
                          {formatDate(msg.fecha)}
                        </div>
                      </div>
                    )}

                    {msg.propietario === 0 ? (
                      <div className="flex justify-center">
                        <div className="bg-pink-100 text-pink-800 px-6 py-3 rounded-full text-sm font-medium shadow-sm max-w-md text-center">
                          ✨ {msg.contenido}
                        </div>
                      </div>
                    ) : (
                      <div className={`flex ${msg.propietario === 1 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md ${msg.propietario === 1 ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              msg.propietario === 1
                                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">{msg.contenido}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${msg.propietario === 1 ? 'justify-end' : 'justify-start'}`}>
                            <span>{formatTime(msg.fecha)}</span>
                            {msg.propietario === 1 && (
                              <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe un mensaje..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all text-sm"
                  />
                </div>

                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-full hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>Enviar</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>

              <div className="flex gap-2 mt-3">
                <button className="text-2xl hover:scale-110 transition-transform">👍</button>
                <button className="text-2xl hover:scale-110 transition-transform">❤️</button>
                <button className="text-2xl hover:scale-110 transition-transform">😂</button>
                <button className="text-2xl hover:scale-110 transition-transform">😮</button>
                <button className="text-2xl hover:scale-110 transition-transform">🔥</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
