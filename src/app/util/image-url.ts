/** Stored photos are http(s) URLs; anything else (empty, legacy values) means the employee has no photo. */
export function isStoredImageUrl(url: string | null | undefined): boolean {
  return /^https?:\/\//.test(url || '');
}
