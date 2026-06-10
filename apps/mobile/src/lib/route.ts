/**
 * Expo Router route types are generated under `.expo/`.
 * The local generator can lag behind new files during scripted edits, so this helper
 * keeps new, real app routes usable while runtime routing still comes from the file tree.
 */
export function appRoute(path: string) {
  return path as never;
}
