import { z, defineCollection } from 'astro:content';

const projectCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Card copy on the home page. Falls back to `description`. */
    summary: z.string().optional(),
    role: z.string(),
    status: z.string(),
    users: z.string().optional(),
    link: z.string().optional(),
    stack: z.array(z.string()),
    order: z.number(),
    /** Which side of the work the case study is written from. */
    lens: z.array(z.enum(['product', 'engineering'])).default(['engineering']),
    /** Up to three figures shown on the home card. Every number must exist in cv.md. */
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).max(3).default([]),
    /** Hide from the home page without deleting the page. */
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'projects': projectCollection,
};
