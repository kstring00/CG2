import {
  INDEPENDENCE_DISCLAIMER,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/siteMeta';

/**
 * Organization + WebSite schema for Common Ground.
 *
 * Deliberately declares no parentOrganization, sponsor, funder, memberOf, or
 * publisher beyond Common Ground itself — the project is independent, and
 * structured data is exactly where a stray affiliation claim would be read as
 * fact by search engines.
 */
export default function SiteStructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logos/common-ground-lockup.png`,
        description: SITE_DESCRIPTION,
        disambiguatingDescription: INDEPENDENCE_DISCLAIMER,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: 'en-US',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
