import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kaevrix | Astrix Network's AI Powered Learning App",
  description: "Kaevrix by Astrix Network is the ultimate AI powered learning app and personalized study platform. Turn education into an RPG, build your skill tree, and level up in real life.",
  keywords: ["Kaevrix", "Astrix Network", "AI powered learning app", "personalized study platform", "AI study tools", "Kaevrix learning", "Astrix"],
  authors: [{ name: "Astrix Network" }],
  creator: "Astrix Network",
  publisher: "Astrix Network",
  metadataBase: new URL("https://astrixnetwork.com"),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Kaevrix | AI Powered Learning App",
    description: "Kaevrix is an AI powered learning app that turns education into an RPG. Build your skill tree, conquer quests, and level up in real life.",
    url: "https://astrixnetwork.com",
    siteName: "Kaevrix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaevrix | AI Powered Learning App",
    description: "Turn education into an RPG. Build your skill tree, conquer quests, and level up in real life.",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Kaevrix",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "description": "Kaevrix by Astrix Network is an AI powered learning app and personalized study platform that turns education into an RPG.",
    "url": "https://astrixnetwork.com",
    "publisher": {
      "@type": "Organization",
      "name": "Astrix Network",
      "url": "https://astrixnetwork.com"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
