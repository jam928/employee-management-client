// Must match what the API accepts (ImageStorageService and spring.servlet.multipart.max-file-size)
export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

/** Returns why the file can't be used as a photo, or null when it can. */
export function validatePhoto(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return 'Choose a JPEG, PNG, GIF or WebP image.';
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return 'That image is larger than 5 MB.';
  }
  return null;
}
