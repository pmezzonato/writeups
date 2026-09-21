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

/**
 * Format a date for display, e.g. "20 Sept 2026".
 *
 * Forced to UTC deliberately. Frontmatter carries date-only values, which parse
 * as UTC midnight; formatting those in a negative-offset local timezone renders
 * the previous day. Without this, a local build and a CI build (which runs in
 * UTC) would disagree about the date on every writeup.
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
