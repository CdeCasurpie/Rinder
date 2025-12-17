# 🔥 RINDER - Aplicación de Matching (Frontend MOCK)

## 📋 DESCRIPCIÓN

Migración completa del frontend de Rinder desde Flask a **Next.js 14** con **servicios MOCK** que simulan Supabase. Esta versión es completamente navegable y funcional **SIN BACKEND REAL**.

### ✅ Estado Actual: COMPLETAMENTE FUNCIONAL

---

## 🎯 OBJETIVO DE ESTA VERSIÓN

Esta es una versión **100% frontend** que permite:
- ✅ Validar UI/UX completa
- ✅ Reproducir todos los flujos reales de la app
- ✅ Mostrar una aplicación "funcionando" en entrevistas/demos
- ✅ Desarrollar sin depender de Supabase
- ✅ Base sólida para conectar Supabase real después

---

## 🏗️ ARQUITECTURA

```
rinder-web/
├── app/                     # Páginas (Next.js App Router)
│   ├── page.tsx            # Dashboard principal
│   ├── login/              # Login/Register
│   └── layout.tsx          # Layout raíz
├── src/
│   ├── components/         # Componentes React
│   │   ├── layout/        # Sidebar, Navbar
│   │   ├── matches/       # Sistema de swipe
│   │   ├── messages/      # Chat/mensajería
│   │   └── profile/       # Perfil, Planes, Soporte
│   ├── services/          # 🎭 SERVICIOS MOCK
│   │   ├── auth.ts        # Autenticación simulada
│   │   ├── profiles.ts    # Perfiles y matching
│   │   └── messages.ts    # Mensajería
│   ├── types/             # TypeScript types
│   ├── styles/            # CSS originales de Flask
│   └── lib/               # Utilidades
└── public/assets/         # Imágenes, logos, iconos
```

---

## 🚀 INSTALACIÓN Y EJECUCIÓN

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos

```bash
# 1. Instalar dependencias
cd rinder-web
npm install

# 2. Ejecutar servidor de desarrollo
npm run dev

# 3. Abrir en navegador
# http://localhost:3000/login
```

---

## 🎮 FLUJOS IMPLEMENTADOS

### 1️⃣ **Autenticación**
- **Login**: Cualquier email/contraseña funciona (mock)
- **Registro**: Valida edad (+18), contraseñas coincidentes, email válido
- **Sesión**: Se mantiene en memoria durante la navegación

### 2️⃣ **Matches (Swipe)**
- Sistema de swipe con animaciones
- Botón ❌ (rechazar): Desliza hacia abajo
- Botón ❤️ (like): Desliza hacia arriba
- **Match automático**: Cada 3 likes genera un match
- Alert de "¡Es un match!" cuando hay coincidencia

### 3️⃣ **Mensajería**
- Lista de chats con usuarios matched
- Conversación en tiempo real (simulada)
- Mensajes propios (derecha) vs otros (izquierda)
- Mensajes del sistema ("Has matcheado!")
- Envío con Enter o botón

### 4️⃣ **Perfil**
- Ver perfil completo
- Editar información (modal overlay)
- Subir foto de perfil (simulado)
- Datos: username, nombre, apellido, descripción, edad, género

### 5️⃣ **Planes**
- Visualización de suscripciones (Básico, VIP, Súper-VIP)
- UI completa lista para integración de pagos

### 6️⃣ **Soporte**
- Información de contacto
- Email: rinder.social@gmail.com
- Teléfono: +51 946 669 408

---

## 🎭 SERVICIOS MOCK

### `auth.ts`
```typescript
// Simula login, register, logout, getCurrentUser
// Usuario mock creado automáticamente al login
await login({ email_login: "test@test.com", password_login: "123" });
```

### `profiles.ts`
```typescript
// 5 perfiles mock pre-cargados
// Sistema de matching simulado
const match = await getRandomMatch(); // Devuelve perfil aleatorio
await checkMatch(userId); // Simula verificación de match
```

### `messages.ts`
```typescript
// 2 chats mock con conversaciones
// Envío de mensajes en tiempo real (local)
await sendMessage(chatId, "Hola!"); // Agrega mensaje instantáneamente
```

---

## 🎨 ESTILOS Y ASSETS

### CSS Originales
Todos los estilos CSS del proyecto Flask original fueron copiados:
- `styles.css` - Estilos base
- `animations.css` - Animaciones de transición
- `matches.css` - Sistema de swipe
- `messages.css` - Chat
- `profile.css` - Perfil
- `login_register.css` - Autenticación

### Assets Copiados
- ✅ Logos (3 variantes)
- ✅ Iconos (16 items: botones, géneros, intereses)
- ✅ Imágenes (43 items: fondos, categorías, hobbies)

---

## 🔧 TECNOLOGÍAS

- **Next.js 14** (App Router)
- **React 18** (Hooks, Context)
- **TypeScript** (Tipado completo)
- **CSS Modules** (Estilos originales)
- **Mock Services** (Simulación de backend)

---

## ⚠️ LIMITACIONES ACTUALES (POR DISEÑO)

### ❌ NO IMPLEMENTADO (porque es frontend only):
- Persistencia real de datos
- Conexión a Supabase
- API routes
- Server actions
- Autenticación real
- Storage de imágenes
- Base de datos

### ✅ IMPLEMENTADO:
- Toda la UI/UX
- Todos los flujos navegables
- Validaciones de formularios
- Animaciones completas
- Sistema de routing
- Gestión de estado local

---

## 📝 DATOS MOCK DISPONIBLES

### Perfiles en el sistema:
1. **María López** (22 años) - Amante del arte
2. **Juan Pérez** (25 años) - Deportista
3. **Sofía García** (21 años) - Estudiante de medicina
4. **Carlos Rodríguez** (28 años) - Ingeniero
5. **Ana Martínez** (23 años) - Fotógrafa

### Chats pre-cargados:
- Chat con María López (3 mensajes)
- Chat con Juan Pérez (2 mensajes)

---

## 🚧 PRÓXIMOS PASOS (SIGUIENTE PROMPT)

1. **Conectar Supabase real**
   - Reemplazar servicios mock por llamadas reales
   - Implementar autenticación con `auth.users`
   - Conectar a las tablas del `schema.sql`

2. **Storage de imágenes**
   - Configurar Supabase Storage
   - Upload real de fotos de perfil

3. **RLS (Row Level Security)**
   - Implementar políticas de seguridad
   - Proteger datos por usuario

4. **Real-time**
   - Mensajes en tiempo real con Supabase Realtime
   - Notificaciones de matches

---

## 🐛 DEBUGGING

### Ver logs del servidor:
```bash
# Terminal muestra compilación y requests
# Buscar errores 404 o 500
```

### Verificar rutas:
- `/` → Dashboard (requiere login)
- `/login` → Autenticación
- Todas las secciones internas son componentes (no rutas)

### Estado de sesión:
- Se resetea al recargar la página
- Para persistir, descomentar localStorage en `auth.ts`

---

## 📞 CONTACTO DEL PROYECTO

- **Email**: rinder.social@gmail.com
- **Teléfono**: +51 946 669 408

---

## 📄 LICENCIA

Proyecto académico - Rinder © 2024
