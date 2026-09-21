import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const boxes = defineCollection({
  loader: glob({ pattern: ['*.md', '!TEMPLATE.md'], base: './boxes' }),
  schema: z.object({
    title: z.string(),
    platform: z.enum(['HTB', 'THM']),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane']),
    os: z.enum(['Linux', 'Windows', 'Other']),
    date: z.coerce.date(),
    // Enforces the HTB rule: publishing an active machine is a build failure.
    status: z.literal('retired'),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    repo: z.url().optional(),
    stack: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { boxes, blog, projects };
