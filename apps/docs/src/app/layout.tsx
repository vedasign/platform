import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import PlausibleProvider from 'next-plausible';

import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.vedasign.uk'),
  title: {
    template: '%s | VedaSign Docs',
    default: 'VedaSign Docs',
  },
  description: 'The official documentation for VedaSign, the open-source document signing platform.',
  openGraph: {
    siteName: 'VedaSign Docs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@documenso',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <PlausibleProvider domain="vedasign.uk">
          <RootProvider>{children}</RootProvider>
        </PlausibleProvider>
      </body>
    </html>
  );
}
