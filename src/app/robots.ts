import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';

/**
 * Private, sign-in-gated and internal routes stay out of the index. The free
 * /support layer is public by design and should be crawlable.
 */
const DISALLOW = ['/api/', '/client', '/client/', '/design-preview', '/intake'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: DISALLOW }],
    sitemap: `${SITE.domain}/sitemap.xml`,
    host: SITE.domain,
  };
}
