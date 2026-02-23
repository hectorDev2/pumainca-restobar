const STORAGE_PUBLIC_PATH = "/storage/v1/object/public/";

/**
 * Extrae el file path relativo al bucket de una URL pública de Supabase Storage.
 * Retorna null si la URL no es válida o no corresponde al bucket indicado.
 *
 * @example
 * extractStoragePath(
 *   "https://xyz.supabase.co/storage/v1/object/public/menu/categories/img.jpg",
 *   "menu"
 * )
 * // → "categories/img.jpg"
 */
export function extractStoragePath(
  publicUrl: string,
  bucket: string,
): string | null {
  try {
    const url = new URL(publicUrl);
    const prefix = `${STORAGE_PUBLIC_PATH}${bucket}/`;
    if (url.pathname.startsWith(prefix)) {
      return decodeURIComponent(url.pathname.slice(prefix.length));
    }
    return null;
  } catch {
    return null;
  }
}
