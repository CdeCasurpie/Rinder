// Utilidad para manejar rutas con basePath en GitHub Pages
export const getAssetPath = (path: string): string => {
  const basePath = process.env.NODE_ENV === 'production' ? '/Rinder' : '';
  return `${basePath}${path}`;
};
