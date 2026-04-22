import { z, defineCollection } from 'astro:content';

const projectCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    role: z.string(),
    status: z.string(),
    users: z.string().optional(),
    link: z.string().optional(),
    stack: z.array(z.string()),
    order: z.number(),
  }),
});

export const collections = {
  'projects': projectCollection,
};
