import { Outfit, Playfair_Display } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "800"],
  style: ["normal", "italic"],
});

export const viewport = {
  themeColor: '#ff6a00',
};

export const metadata = {
  applicationName: "Kaevrix",
  title: "Kaevrix - AI Personalized Learning Platform",
  description: "Kaevrix by Astrix Network is the ultimate AI powered learning app and personalized study platform. Turn education into an RPG, build your skill tree, and level up in real life.",
  keywords: ["Kaevrix", "Astrix Network", "AI powered learning app", "personalized study platform", "AI study tools", "Kaevrix learning", "Astrix"],
  authors: [{ name: "Astrix Network" }],
  creator: "Astrix Network",
  publisher: "Astrix Network",
  metadataBase: new URL("https://astrixnetwork.com"),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Kaevrix - AI Personalized Learning Platform",
    description: "Kaevrix is an AI powered learning app that turns education into an RPG. Build your skill tree, conquer quests, and level up in real life.",
    url: "https://astrixnetwork.com",
    siteName: "Kaevrix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaevrix - AI Personalized Learning Platform",
    description: "Turn education into an RPG. Build your skill tree, conquer quests, and level up in real life.",
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Astrix Network",
      "url": "https://astrixnetwork.com",
      "logo": "https://astrixnetwork.com/icon.png"
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Kaevrix",
      "url": "https://astrixnetwork.com",
      "publisher": {
        "@type": "Organization",
        "name": "Astrix Network"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": ["SoftwareApplication", "EducationalApplication"],
      "name": "Kaevrix - AI Personalized Learning Platform",
      "operatingSystem": "Web",
      "applicationCategory": "EducationalApplication",
      "description": "Kaevrix by Astrix Network is an AI powered learning app and personalized study platform that turns education into an RPG.",
      "url": "https://astrixnetwork.com"
    }
  ];

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
