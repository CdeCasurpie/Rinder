-- ============================================================================
-- SCHEMA.SQL - Migración de Rinder a Supabase (DISEÑO CORRECTO)
-- ============================================================================
-- 
-- CAMBIOS ARQUITECTÓNICOS:
-- ✅ Usa auth.users de Supabase para autenticación (email, contraseña)
-- ✅ Elimina tabla "usuario" redundante
-- ✅ Perfil usa auth.users.id como PK (relación 1:1 directa)
-- ✅ Todas las FK apuntan a auth.users.id
-- ✅ Username ahora es campo único en perfil (no PK)
-- ✅ Sin RLS por ahora (se implementa después)
--
-- NOTAS:
-- - auth.users.id es UUID generado por Supabase
-- - Supabase maneja hashing de contraseñas automáticamente
-- - created_at ya existe en auth.users
-- ============================================================================


-- ============================================================================
-- 1. TABLA: perfil
-- ============================================================================
-- Información pública del usuario para matching
-- PK: id (UUID de auth.users)
-- Relación: 1:1 con auth.users
-- ============================================================================

CREATE TABLE perfil (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nacimiento DATE NOT NULL,
    edad INTEGER NOT NULL,
    genero VARCHAR(50),
    descripcion VARCHAR(500),
    ruta_photo VARCHAR(200),
    likes_restantes INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas comunes
CREATE INDEX idx_perfil_username ON perfil(username);
CREATE INDEX idx_perfil_genero ON perfil(genero);
CREATE INDEX idx_perfil_edad ON perfil(edad);

-- COMENTARIO: 
-- - id = auth.users.id (UUID del usuario autenticado)
-- - username ahora es campo único (no PK)
-- - likes_restantes se movió aquí desde usuario
-- - email/contraseña viven en auth.users (Supabase los maneja)


-- ============================================================================
-- 2. TABLA: likea_perfil
-- ============================================================================
-- Sistema de likes entre usuarios (base del matching)
-- PK compuesta: (id_usuario, id_usuario2)
-- Lógica: Si A likea a B Y B likea a A = MATCH (se crea un chat)
-- ============================================================================

CREATE TABLE likea_perfil (
    id_usuario UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    id_usuario2 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id_usuario, id_usuario2),
    CHECK (id_usuario != id_usuario2)
);

-- Índice para verificar matches bidireccionales
CREATE INDEX idx_likea_perfil_reverse ON likea_perfil(id_usuario2, id_usuario);


-- ============================================================================
-- 3. TABLA: mensaje
-- ============================================================================
-- Mensajes individuales dentro de chats
-- Estructura de LINKED LIST: cada mensaje apunta al anterior
-- PK: id_mensaje (UUID)
-- FK: id_usuarioremitente puede ser NULL (mensajes del sistema: "Has matcheado!")
-- ============================================================================

CREATE TABLE mensaje (
    id_mensaje UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuarioremitente UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    id_chat UUID, -- FK definida después (circular con chat)
    id_mensajePadre UUID REFERENCES mensaje(id_mensaje) ON DELETE SET NULL,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    contenido VARCHAR(500),
    state VARCHAR(50),
    formato VARCHAR(50)
);

-- Índices para navegación
CREATE INDEX idx_mensaje_chat ON mensaje(id_chat);
CREATE INDEX idx_mensaje_remitente ON mensaje(id_usuarioremitente);
CREATE INDEX idx_mensaje_padre ON mensaje(id_mensajePadre);
CREATE INDEX idx_mensaje_fecha ON mensaje(fecha DESC);


-- ============================================================================
-- 4. TABLA: chat
-- ============================================================================
-- Conversaciones entre dos usuarios que hicieron match
-- PK: id_chat (UUID)
-- FK: id_usuario, id_usuario2 -> auth.users.id
-- FK: id_mensaje -> último mensaje (quick access)
-- ============================================================================

CREATE TABLE chat (
    id_chat UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    id_usuario2 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    id_mensaje UUID REFERENCES mensaje(id_mensaje) ON DELETE SET NULL,
    fecha TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CHECK (id_usuario != id_usuario2),
    UNIQUE (id_usuario, id_usuario2)
);

-- Agregar FK de mensaje.id_chat ahora que chat existe
ALTER TABLE mensaje ADD CONSTRAINT fk_mensaje_chat 
    FOREIGN KEY (id_chat) REFERENCES chat(id_chat) ON DELETE CASCADE;

-- Índices para búsqueda de chats
CREATE INDEX idx_chat_usuario1 ON chat(id_usuario);
CREATE INDEX idx_chat_usuario2 ON chat(id_usuario2);
CREATE INDEX idx_chat_ultimo_mensaje ON chat(id_mensaje);


-- ============================================================================
-- 5. TABLA: publicacion
-- ============================================================================
-- Contenido generado por usuarios (posts, comentarios heredan de aquí)
-- PK: id_publicacion (UUID)
-- FK: id_usuario -> auth.users.id
-- ============================================================================

CREATE TABLE publicacion (
    id_publicacion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contenido VARCHAR(500),
    cantidad_likes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para feed
CREATE INDEX idx_publicacion_usuario ON publicacion(id_usuario);
CREATE INDEX idx_publicacion_created ON publicacion(created_at DESC);


-- ============================================================================
-- 6. TABLA: post
-- ============================================================================
-- Especialización: Publicación tipo "post" (herencia tabla única)
-- ============================================================================

CREATE TABLE post (
    id_publicacion UUID PRIMARY KEY REFERENCES publicacion(id_publicacion) ON DELETE CASCADE
);


-- ============================================================================
-- 7. TABLA: comentario
-- ============================================================================
-- Especialización: Publicación que es comentario de otra publicación
-- FK: id_publicacion2 -> publicación padre
-- ============================================================================

CREATE TABLE comentario (
    id_publicacion UUID PRIMARY KEY REFERENCES publicacion(id_publicacion) ON DELETE CASCADE,
    id_publicacion2 UUID NOT NULL REFERENCES publicacion(id_publicacion) ON DELETE CASCADE,
    CHECK (id_publicacion != id_publicacion2)
);

-- Índice para obtener comentarios de una publicación
CREATE INDEX idx_comentario_publicacion_padre ON comentario(id_publicacion2);


-- ============================================================================
-- 8. TABLA: likea_publicacion
-- ============================================================================
-- Sistema de likes en publicaciones (N:N)
-- PK compuesta: (id_usuario, id_usuario2, id_publicacion)
-- NOTA: Diseño original mantiene id_usuario2 (posible redundancia)
-- ============================================================================

CREATE TABLE likea_publicacion (
    id_usuario UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    id_usuario2 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    id_publicacion UUID NOT NULL REFERENCES publicacion(id_publicacion) ON DELETE CASCADE,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id_usuario, id_usuario2, id_publicacion)
);

-- Índices para consultas
CREATE INDEX idx_likea_publicacion_pub ON likea_publicacion(id_publicacion);
CREATE INDEX idx_likea_publicacion_usuario ON likea_publicacion(id_usuario);


-- ============================================================================
-- 9. TABLA: suscripcion
-- ============================================================================
-- Catálogo de planes de suscripción premium
-- PK: nombre (VARCHAR)
-- ============================================================================

CREATE TABLE suscripcion (
    nombre VARCHAR(50) PRIMARY KEY,
    precio NUMERIC(10, 2) NOT NULL,
    day_duration INTEGER DEFAULT 30,
    created TIMESTAMPTZ DEFAULT NOW(),
    modified TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 10. TABLA: compra
-- ============================================================================
-- Historial de compras de suscripciones
-- PK: id_compra (UUID)
-- FK: id_usuario -> auth.users.id
-- Almacena precio histórico
-- ============================================================================

CREATE TABLE compra (
    id_compra UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_suscripcion VARCHAR(50) NOT NULL REFERENCES suscripcion(nombre) ON DELETE RESTRICT,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    precio_compra NUMERIC(10, 2) NOT NULL
);

-- Índices para reportes
CREATE INDEX idx_compra_usuario ON compra(id_usuario);
CREATE INDEX idx_compra_suscripcion ON compra(nombre_suscripcion);
CREATE INDEX idx_compra_fecha ON compra(fecha DESC);


-- ============================================================================
-- TRIGGERS: Auto-actualización de modified_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
CREATE TRIGGER update_perfil_modified_at 
    BEFORE UPDATE ON perfil 
    FOR EACH ROW EXECUTE FUNCTION update_modified_at_column();

CREATE TRIGGER update_publicacion_modified_at 
    BEFORE UPDATE ON publicacion 
    FOR EACH ROW EXECUTE FUNCTION update_modified_at_column();

CREATE TRIGGER update_suscripcion_modified_at 
    BEFORE UPDATE ON suscripcion 
    FOR EACH ROW EXECUTE FUNCTION update_modified_at_column();


-- ============================================================================
-- TRIGGER: Auto-crear perfil cuando se registra usuario en auth.users
-- ============================================================================
-- Este trigger crea automáticamente un registro en "perfil" cuando
-- Supabase crea un usuario en auth.users (signup)
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO perfil (id, username, nombre, apellido, nacimiento, edad)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
        COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
        COALESCE((NEW.raw_user_meta_data->>'nacimiento')::date, CURRENT_DATE),
        COALESCE((NEW.raw_user_meta_data->>'edad')::integer, 18)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejecutar trigger después de INSERT en auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================================
-- DATOS INICIALES
-- ============================================================================

INSERT INTO suscripcion (nombre, precio, day_duration) VALUES
    ('Básica', 0.00, 30),
    ('Premium', 9.99, 30),
    ('Gold', 19.99, 30)
ON CONFLICT (nombre) DO NOTHING;


-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================
-- MIGRACIÓN COMPLETA:
-- 
-- ✅ auth.users maneja autenticación
-- ✅ perfil (id = auth.users.id) almacena datos del matching
-- ✅ Todas las FK apuntan a auth.users.id
-- ✅ Trigger auto-crea perfil en signup
-- ✅ Sin tabla "usuario" redundante
--
-- PARA EJECUTAR:
-- 1. Supabase Dashboard → SQL Editor
-- 2. Pegar este script completo
-- 3. Run
-- 4. Verificar que todas las tablas se crearon
-- ============================================================================
