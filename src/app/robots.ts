import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/siteMeta';

/**
 * The client portal is a demo surface tied to no real records, so it stays out
 * of the index; everything in the free parent layer is meant to be findable.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/client', '/client/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
