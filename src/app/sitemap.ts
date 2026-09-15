import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';

/**
 * Public routes only — the client portal is sign-in gated and the
 * design-preview / intake routes are internal.
 */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/welcome', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/support', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/support/find', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/support/providers', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/support/resources', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/support/what-is-aba', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/support/care-plan', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/support/care-plan/crisis', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/support/crisis', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/support/help', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/support/at-home', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/support/caregiver', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/support/caregiver/identity', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/support/check-in', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/support/community', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/support/connect', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/support/couples', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/support/financial', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/support/hard-days', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/support/mental-health', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/support/pathfinders', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/support/sensory-friendly', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/support/siblings', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/support/sleep', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/support/intake', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/today', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/calm', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE.domain}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
