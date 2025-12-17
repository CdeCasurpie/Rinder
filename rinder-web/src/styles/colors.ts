/**
 * COLORS.TS - Paleta de colores extraída del proyecto Flask original
 * 
 * FUENTES:

 * - static/styles/styles.css
 * - static/styles/login_register.css
 * - static/styles/matches.css
 * - static/styles/messages.css
 * - static/styles/profile.css
 * - static/styles/posts.css
 * 
 * NOTA: Estos son los colores EXACTOS encontrados en el código original.
 * No se han modificado, unificado ni optimizado.
 */

export const colors = {
  // === COLORES PRIMARIOS (GRADIENTES SIDEBAR) ===
  primary: "#ff0054",           // Inicio gradiente sidebar
  primaryDark: "#ff00a2",       // Fin gradiente sidebar, botones principales
  primaryHover: "#ff0089",      // Hover de botones
  
  // === COLORES ROSADOS/FUCSIA ===
  pink: "#FF007F",              // Títulos h1-h4, info de matches
  pinkLight: "#f9b9d0",         // Background hover botón like (left-matches)
  pinkLighter: "#ffe1ec",       // Background botón like base
  pinkActive: "#f9a3c3",        // Active state botón like
  pinkBorder: "rgb(235 214 224)", // Bordes redondeados (.rounded-pink-border)
  pinkMessage: "#f8e5ee",       // Background mensajes del sistema
  pinkAccent: "#e15a87",        // Borde contacto activo en mensajes
  
  // === COLORES ROJOS (BOTÓN RECHAZAR) ===
  redLight: "#ffe5e5",          // Background botón equis base
  redHover: "#ffc8c8",          // Hover botón equis
  redActive: "#fdb9b9",         // Active botón equis
  redLiked: "#ff0000",          // Color corazón cuando está liked
  
  // === BACKGROUNDS ===
  background: "#F7F3F7",        // Background principal body
  backgroundWhite: "#fff",      // Blanco puro
  backgroundWhiteAlt: "#ffffff", // Blanco alternativo (adds-container)
  backgroundGray: "#f5f5f5",    // Inicio gradiente adds-container
  
  // === BACKGROUNDS CON TRANSPARENCIA ===
  bgTransparent05: "rgba(0, 0, 0, .05)",    // Backgrounds sutiles
  bgTransparent035: "rgba(0, 0, 0, .035)",  // Contact box active
  bgTransparent015: "rgba(0, 0, 0, .015)",  // User message info
  bgTransparent02: "rgba(0, 0, 0, .02)",    // Scrollbar thumb
  bgTransparent1: "rgba(0, 0, 0, .1)",      // Hover states
  bgTransparent2: "rgba(0, 0, 0, .2)",      // Shadow, active states
  bgTransparent3: "rgba(255, 255, 255, 0.3)", // Sidebar active
  bgTransparent2White: "rgba(255, 255, 255, 0.2)", // Sidebar hover
  bgTransparent5: "rgba(0, 0, 0, 0.5)",     // Fullscreen overlay
  
  // === TEXTO ===
  textPrimary: "#333333",       // Color de texto principal
  textWhite: "#fff",            // Texto blanco
  textWhiteAlt: "white",        // Texto blanco alternativo
  textGray: "GREY",             // Texto gris (Planes)
  textGrayDark: "#343434",      // Texto oscuro (botones perfil)
  textGrayMedium: "#444",       // Texto file upload
  textBlack: "black",           // Negro puro
  
  // === BORDES ===
  border: "#d5d5d5",            // Bordes inputs
  borderLight: "#ddd",          // Bordes file upload
  borderGray: "#eae7ea",        // Bordes inputs posts
  borderDark: "#e9e7ea",        // Textarea description
  borderBlue: "#68a9ef",        // Focus file upload
  borderBlackThick: "2px solid black", // Bordes planes
  
  // === ESTADOS - ERROR ===
  error: "red",                 // Mensajes de error
  
  // === ESTADOS - AZUL (BOTONES SECUNDARIOS) ===
  blue: "#007bff",              // Botones azules (add photo, send)
  blueHover: "#0062cc",         // Hover botones azules
  blueDark: "rgb(4, 4, 179)",   // Hover btn-send
  blueMessage: "#306ffc",       // Background mensajes de otros usuarios
  
  // === ESTADOS - GRIS (BOTONES PERFIL) ===
  grayButton: "#e4e0e0",        // Background btn-edit-profile
  grayButtonHover: "#f1eded",   // Hover btn-edit-profile
  grayFile: "#f8f8f8",          // Background file upload button
  
  // === SOMBRAS ===
  shadowDark: "0 0 102px rgba(0,0,0,.2)", // Shadow foto perfil matches
  shadowPlanes: "2px 2px 5px rgba(0, 0, 0, 0.3)", // Shadow botones planes
  
  // === COLORES ESPECÍFICOS DE COMPONENTES ===
  // Sidebar
  sidebarGradientStart: "#ff0054",
  sidebarGradientEnd: "#ff00a2",
  
  // Adds container
  addsGradientStart: "#f5f5f5",
  addsGradientEnd: "#ffffff",
  
  // Posts - Focus input
  postsFocusBorder: "#ff007f",
  
  // Mensajes - otros usuarios
  messageOther: "#306ffc",
  
  // Perfil - foto overlay
  photoOverlay: "rgba(0, 0, 0, 0.5)",
};

/**
 * GRADIENTES EXTRAÍDOS
 */
export const gradients = {
  sidebar: "linear-gradient(to bottom, #ff0054, #ff00a2)",
  addsContainer: "linear-gradient(to bottom, #f5f5f5, #ffffff)",
};

/**
 * OPACIDADES USADAS (para rgba)
 */
export const opacities = {
  verySubtle: 0.015,
  subtle: 0.02,
  light: 0.035,
  medium: 0.05,
  visible: 0.1,
  strong: 0.2,
  overlay: 0.5,
  sidebarHover: 0.2,
  sidebarActive: 0.3,
};

/**
 * RADIOS DE BORDE COMUNES
 */
export const borderRadius = {
  small: "5px",
  medium: "6px",
  large: "10px",
  xlarge: "15px",
  xxlarge: "20px",
  xxxlarge: "28px",
  round: "100%",
  rounded: "50%",
};

/**
 * SOMBRAS
 */
export const shadows = {
  profile: "0 0 102px rgba(0,0,0,.2)",
  planes: "2px 2px 5px rgba(0, 0, 0, 0.3)",
};
