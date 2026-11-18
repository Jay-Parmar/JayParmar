const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** A path under the site's base, like /JayParmar/projects/hirejutsu/. */
export function link(path = ''): string {
  return `${base}/${path.replace(/^\//, '')}`;
}
