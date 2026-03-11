import { getRequiredSupabaseClient } from './api/client';

const LOCAL_AVATAR_KEY = 'avatar-local';
const MAX_DIMENSION = 400;
const MAX_QUALITY = 0.8;

/**
 * Crop and compress an image file to a square JPEG blob.
 * Uses Canvas API for client-side processing.
 */
export async function cropAndCompressImage(
  file: File,
  cropRect?: { x: number; y: number; width: number; height: number },
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = MAX_DIMENSION;
      canvas.height = MAX_DIMENSION;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // If no crop rect, use center square
      const rect = cropRect ?? getCenterSquare(img.width, img.height);

      ctx.drawImage(
        img,
        rect.x, rect.y, rect.width, rect.height,
        0, 0, MAX_DIMENSION, MAX_DIMENSION,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create image blob'));
        },
        'image/jpeg',
        MAX_QUALITY,
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

function getCenterSquare(w: number, h: number) {
  const size = Math.min(w, h);
  return {
    x: (w - size) / 2,
    y: (h - size) / 2,
    width: size,
    height: size,
  };
}

/**
 * Upload avatar to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadAvatarToStorage(blob: Blob, userId: string): Promise<string> {
  const client = getRequiredSupabaseClient();
  const path = `${userId}/avatar.jpg`;

  const { error } = await client.storage
    .from('avatars')
    .upload(path, blob, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) throw error;

  const { data } = client.storage.from('avatars').getPublicUrl(path);
  // Add cache-busting timestamp
  return `${data.publicUrl}?t=${Date.now()}`;
}

/**
 * Store avatar as base64 in localStorage for anonymous users.
 * Separate from Zustand persist to avoid bloating the store snapshot.
 */
export function setLocalAvatar(base64: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_AVATAR_KEY, base64);
  }
}

/**
 * Get locally stored avatar for anonymous users.
 */
export function getLocalAvatar(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOCAL_AVATAR_KEY);
}

/**
 * Convert a Blob to base64 data URI.
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
