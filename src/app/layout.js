import { Outfit, Playfair_Display, Orbitron, Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";
import "./landing.css";

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

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport = {
  themeColor: '#E07A5F',
};

export const metadata = {
  applicationName: "Kaevrix",
  title: "Kaevrix — AI Study App & Personalized Learning Platform",
  description: "Kaevrix is a new AI study app that turns any topic into a personalized learning path, AI-generated study notes, and gamified skill trees. The smartest way to learn anything — track progress, quiz yourself, and actually remember what you study.",
  keywords: [
    "kaevrix",
    "ai study app",
    "new ai study app",
    "ai learning app",
    "best ai apps for studying",
    "ai apps for students",
    "ai learning app 2025",
    "ai study tool",
    "personalized learning platform",
    "personalized learning app",
    "adaptive learning platform",
    "gamified learning platform",
    "learning roadmap generator",
    "ai generated learning paths",
    "skill development platform",
    "interactive learning platform",
    "ai study notes generator",
    "ai note taker for students",
    "active recall app",
    "spaced repetition app",
    "personalized education app",
    "study productivity app",
    "learning rpg",
    "rpg study app",
    "gamified education",
    "skill tree learning",
    "ai upskilling platform",
    "astrix network"
  ],
  authors: [{ name: "Astrix Network" }],
  creator: "Astrix Network",
  publisher: "Astrix Network",
  metadataBase: new URL("https://astrixnetwork.com"),
  alternates: {
    canonical: '/',
    types: {
      'text/plain': [
        { url: '/llms.txt', title: 'LLM Knowledge Base' },
        { url: '/llms-full.txt', title: 'LLM Full Documentation' },
      ],
    },
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    title: "Kaevrix — AI Study App & Personalized Learning Platform",
    description: "The new AI study app that turns anything you want to learn into a personalized skill tree. AI study notes, knowledge quizzes, progress tracking, and gamified progression — all in one place.",
    url: "https://astrixnetwork.com",
    siteName: "Kaevrix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaevrix — AI Study App & Personalized Learning Platform",
    description: "The new AI study app that turns anything you want to learn into a personalized skill tree. AI study notes, knowledge quizzes, progress tracking, and gamified progression — all in one place.",
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
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
      "name": "Kaevrix",
      "alternateName": ["Kaevrix AI", "Kaevrix Learning", "Kaevrix Study App"],
      "operatingSystem": "Web, iOS, Android",
      "applicationCategory": "EducationalApplication",
      "applicationSubCategory": "AI Study App",
      "description": "Kaevrix is a new AI study app and personalized learning platform that turns your goals into adaptive skill trees, AI-generated study notes, and gamified progression. The smartest way to learn anything online.",
      "url": "https://astrixnetwork.com",
      "sameAs": [
        "https://astrixnetwork.com"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "student"
      },
      "learningResourceType": [
        "AI study notes",
        "interactive quiz",
        "skill tree",
        "learning roadmap",
        "personalized learning path"
      ],
      "educationalLevel": "All levels",
      "keywords": "ai study app, personalized learning, ai learning app, gamified learning, skill tree, study notes, active recall",
      "featureList": [
        "AI-generated personalized skill trees and learning paths",
        "Smart video feed matched to your current topic",
        "Sanctum: AI study notes and knowledge quizzes from any video",
        "Chronos: Study progress tracker with streak system and finish date predictions",
        "Study together with friends in co-op rooms",
        "XP, levels, unlockable avatar cosmetics, and verified skill profiles",
        "Gamified RPG progression system for learning",
        "AI-powered adaptive learning that adjusts to your pace"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What is Kaevrix?", "acceptedAnswer": { "@type": "Answer", "text": "Kaevrix is a learning app that turns any subject into an interactive skill tree. It recommends the best videos, creates AI study notes, quizzes you to make sure you remember, and tracks your progress — all in one place." } },
        { "@type": "Question", "name": "What is Sanctum?", "acceptedAnswer": { "@type": "Answer", "text": "Sanctum is your personal study room. Pick any video tutorial, and Sanctum turns it into clean, organized study notes. Then it quizzes you on the key points so you actually retain what you learned, not just passively watch." } },
        { "@type": "Question", "name": "What is Chronos?", "acceptedAnswer": { "@type": "Answer", "text": "Chronos is your study dashboard. It tracks how much you study each day, shows when you'll finish your current topic, keeps your daily streak going, and automatically saves your notes as a downloadable PDF — like building your own textbook." } },
        { "@type": "Question", "name": "What is a learning roadmap?", "acceptedAnswer": { "@type": "Answer", "text": "It's a personalized study plan. Tell Kaevrix what you want to learn (like full-stack development), and it creates a clear, step-by-step path from beginner to advanced." } },
        { "@type": "Question", "name": "How are skill trees created?", "acceptedAnswer": { "@type": "Answer", "text": "Our AI breaks any topic into smaller, logical steps. It figures out what you need to learn first, then maps out the whole path visually. As you complete quizzes, you unlock the next topics." } },
        { "@type": "Question", "name": "How does quizzing help me learn?", "acceptedAnswer": { "@type": "Answer", "text": "Quizzing (active recall) forces your brain to pull information from memory instead of just re-reading it. Research shows this is one of the most effective ways to actually remember what you study long-term." } },
        { "@type": "Question", "name": "How does progress tracking work?", "acceptedAnswer": { "@type": "Answer", "text": "Every quiz you pass and every lesson you finish earns XP. Your profile shows your level, your skill tree progress, and which topics you've mastered — a clear record of everything you've learned." } }
      ]
    }
  ];

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} ${orbitron.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="text/plain" title="LLM Knowledge Base" href="/llms.txt" />
        <link rel="alternate" type="text/plain" title="LLM Full Documentation" href="/llms-full.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && process.env.NEXT_PUBLIC_GA_ID !== "G-XXXXXXXXXX" && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
