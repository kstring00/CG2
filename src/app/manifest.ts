import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.orgName} — Parent Navigation for Autism Families`,
    short_name: SITE.orgName,
    description:
      'Clear next steps, local support, and real help for families on the autism journey. Free, no sign-up required.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f2f4f8',
    theme_color: '#1a2e52',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
