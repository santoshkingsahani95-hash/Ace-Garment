import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "DAISY HUB | Modern Women's Fashion & Luxury Boutique Nepal",
  description:
    "Discover modern women's clothing at DAISY HUB. Elevated basic tops, satin dresses, tailored trousers, and matching co-ord sets designed for everyday confidence.",
  keywords: [
    'women fashion Nepal',
    'DAISY HUB',
    'daisy hub np',
    'women clothing Kathmandu',
    'dresses online Nepal',
    'crop tops',
    'co-ord sets',
    'satin dresses',
  ],
  openGraph: {
    title: "DAISY HUB | Women's Fashion",
    description: "Modern women's clothing designed for every version of you.",
    url: 'https://www.instagram.com/daisy_hubnp?stkn=MTh4dTQzeGxoMXpnYg==',
    siteName: 'DAISY HUB',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'DAISY HUB Campaign',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
