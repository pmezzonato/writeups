import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublished } from '../lib/content';

export async function GET(context: APIContext) {
  const [boxes, posts, projects] = await Promise.all([
    getPublished('boxes'),
    getPublished('blog'),
    getPublished('projects'),
  ]);

  const items = [
    ...boxes.map((e) => ({ e, section: 'boxes' })),
    ...posts.map((e) => ({ e, section: 'blog' })),
    ...projects.map((e) => ({ e, section: 'projects' })),
  ]
    .sort((a, b) => new Date(b.e.data.date).valueOf() - new Date(a.e.data.date).valueOf())
    .map(({ e, section }) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: new Date(e.data.date),
      // Relative, with no leading slash: resolved against `site` below, which
      // carries the base path. A leading slash would discard it.
      link: `${section}/${e.id}/`,
    }));

  // `context.site` is the bare origin and omits `base`, so item links would
  // resolve to /boxes/... instead of /writeups/boxes/... and 404.
  const site = new URL(import.meta.env.BASE_URL, context.site!);

  return rss({
    title: 'writeups — Pedro Mezzonato',
    description: 'Security writeups, labs and notes.',
    site,
    items,
  });
}
