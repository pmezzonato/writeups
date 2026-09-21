import { getCollection, type CollectionKey } from 'astro:content';

/** Non-draft entries in a collection, newest first. */
export async function getPublished<K extends CollectionKey>(collection: K) {
  const entries = await getCollection(collection, ({ data }) => data.draft !== true);
  return entries.sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
  );
}

/** Join a path onto the configured base path, collapsing duplicate slashes. */
export function href(path: string): string {
  return `${import.meta.env.BASE_URL}/${path}`.replace(/\/{2,}/g, '/');
}

/** Format a date for display, e.g. "20 Sep 2026". */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
