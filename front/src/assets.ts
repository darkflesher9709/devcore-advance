/** Build a public asset URL that also works when hosted below a GitHub Pages repo path. */
export function publicAsset(path: string): string {
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`
  return `${baseUrl}${path.replace(/^\/+/, '')}`
}
