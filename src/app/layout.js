import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/animations.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://elux.example.com'),
  title: {
    default: 'Elux',
    template: '%s | Elux',
  },
  description:
    'Elux is a modern ecommerce brand offering premium home electronic appliances — refrigerators, air conditioners, washing machines and more — engineered for performance, efficiency, and style.',
  applicationName: 'Elux',
  keywords: [
    'Elux',
    'home appliances',
    'electronic appliances',
    'refrigerator',
    'air conditioner',
    'washing machine',
    'ecommerce',
    'Pakistan',
  ],
  authors: [{ name: 'Elux' }],
  creator: 'Elux',
  publisher: 'Elux',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://elux.example.com',
    siteName: 'Elux',
    title: 'Elux — Premium Home Electronic Appliances',
    description:
      'Explore premium refrigerators, ACs, and washers. Elux delivers performance, efficiency, and elegant design for modern living.',
    images: [
      {
        url: '/images/og-elux.svg',
        width: 1200,
        height: 630,
        alt: 'Elux — premium home electronic appliances',
      },
    ],
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@elux',
    title: 'Elux — Premium Home Electronic Appliances',
    description:
      'Explore premium refrigerators, ACs, and washers. Elux delivers performance, efficiency, and elegant design for modern living.',
    images: ['/images/og-elux.svg'],
  },
  icons: {
    icon: [
      { url: '/elux-favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/elux-favicon.svg'],
    apple: [
      { url: '/elux-favicon.svg' },
    ],
  },
  alternates: {
    canonical: 'https://elux.example.com',
  },
  category: 'ecommerce',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="relative min-h-screen overflow-x-hidden">
            {/* Background layers: Tech theme (lightened) */}
            <div className="pointer-events-none absolute inset-0 tech-gradient z-0" />
            <div className="pointer-events-none absolute inset-0 tech-grid z-0" />
            <div className="pointer-events-none absolute inset-0 tech-glow z-0" />
            <div className="pointer-events-none absolute inset-0 tech-noise z-0" />

            {/* Foreground content */}
            <div className="relative z-10">
              <Navbar />
              <main>{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
