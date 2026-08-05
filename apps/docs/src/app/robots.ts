import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: 'https://docs.vedasign.uk',
    sitemap: 'https://docs.vedasign.uk/sitemap.xml',
  };
}
