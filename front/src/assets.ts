/** Build a public asset URL that also works when hosted below a GitHub Pages repo path. */
export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
