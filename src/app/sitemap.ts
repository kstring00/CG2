import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/siteMeta';

/**
 * Public routes only. The client portal is demo-only and excluded here and in
 * robots.ts; /design-preview is the homepage module and redirects to `/`, so
 * it is deliberately absent rather than competing with it for the same content.
 */
const ROUTES: Array<[path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']]> = [
  ['/', 1, 'monthly'],
  ['/support', 0.9, 'monthly'],
  ['/support/intake', 0.8, 'monthly'],
  ['/support/care-plan', 0.8, 'monthly'],
  ['/support/care-plan/crisis', 0.6, 'yearly'],
  ['/support/find', 0.8, 'monthly'],
  ['/support/resources', 0.8, 'monthly'],
  ['/support/what-is-aba', 0.7, 'yearly'],
  ['/support/at-home', 0.7, 'monthly'],
  ['/support/caregiver', 0.7, 'monthly'],
  ['/support/caregiver/identity', 0.6, 'yearly'],
  ['/support/mental-health', 0.7, 'monthly'],
  ['/support/hard-days', 0.7, 'monthly'],
  ['/support/couples', 0.6, 'yearly'],
  ['/support/siblings', 0.6, 'yearly'],
  ['/support/sleep', 0.6, 'yearly'],
  ['/support/financial', 0.7, 'yearly'],
  ['/support/providers', 0.7, 'monthly'],
  ['/support/community', 0.6, 'monthly'],
  ['/support/connect', 0.6, 'monthly'],
  ['/support/sensory-friendly', 0.6, 'monthly'],
  ['/support/pathfinders', 0.5, 'yearly'],
  ['/support/help', 0.5, 'monthly'],
  ['/support/crisis', 0.7, 'yearly'],
  ['/support/check-in', 0.5, 'monthly'],
  ['/today', 0.5, 'weekly'],
  ['/calm', 0.5, 'yearly'],
  ['/intake', 0.5, 'monthly'],
  ['/welcome', 0.6, 'yearly'],
  ['/privacy', 0.3, 'yearly'],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(([path, priority, changeFrequency]) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
