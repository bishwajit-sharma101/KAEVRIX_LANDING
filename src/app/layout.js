import { Outfit, Playfair_Display } from "next/font/google";
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

export const viewport = {
  themeColor: '#E07A5F',
};

export const metadata = {
  applicationName: "Kaevrix",
  title: "Kaevrix — AI Learning App & Adaptive Study Platform",
  description: "Kaevrix by Astrix Network is the ultimate AI learning app and adaptive study platform. Master complex skills with AI-generated branching skill trees, automated note synthesis in Sanctum, study velocity in Chronos, and active recall combat trials.",
  keywords: [
    "kaevrix",
    "ai learning app",
    "ai study app",
    "kaevrix ai learning app",
    "adaptive learning platform",
    "personalized learning app",
    "learning roadmap generator",
    "sanctum ai study notes",
    "chronos study velocity",
    "active recall study app",
    "ai education platform",
    "astrix network",
    "education rpg",
    "gamified learning platform"
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
  openGraph: {
    title: "Kaevrix — AI Learning App & Adaptive Study Platform",
    description: "Transform education from passive watching into active mastery with AI skill trees, Sanctum notes, and Chronos velocity tracking.",
    url: "https://astrixnetwork.com",
    siteName: "Kaevrix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaevrix — AI Learning App & Adaptive Study Platform",
    description: "Transform education from passive watching into active mastery with AI skill trees, Sanctum notes, and Chronos velocity tracking.",
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
      "name": "Kaevrix — AI Learning App & Adaptive Study Platform",
      "operatingSystem": "Web",
      "applicationCategory": "EducationalApplication",
      "description": "Kaevrix by Astrix Network is the ultimate AI learning app and adaptive study platform. It turns passive video tutorials into branching skill trees, automated AI note synthesis, study velocity tracking, and active recall trials.",
      "url": "https://astrixnetwork.com",
      "featureList": [
        "Cognitive Pathfinder: AI-generated branching skill trees",
        "Sanctum: Automated AI video note synthesis and code breakdown",
        "Chronos: Study velocity tracking and auto-generated PDF textbooks",
        "Active Recall Combat: Anti-illusion retrieval verification and quiz boss trials",
        "Synchronized Taverns: 8-player co-op study rooms",
        "Soulbound Proof of Work: Verifiable on-chain XP and 25+ mythic visual auras"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What is Kaevrix?", "acceptedAnswer": { "@type": "Answer", "text": "Kaevrix is an AI learning app and adaptive study platform by Astrix Network that transforms educational tutorials into an interactive mastery journey using personalized skill trees, AI note synthesis, and active recall." } },
        { "@type": "Question", "name": "What is Sanctum in Kaevrix?", "acceptedAnswer": { "@type": "Answer", "text": "Sanctum is Kaevrix's dedicated solo study chamber. It converts raw video tutorials into structured AI study guides, code breakdowns, and active recall trials so learners master complex topics at their own pace." } },
        { "@type": "Question", "name": "What is Chronos in Kaevrix?", "acceptedAnswer": { "@type": "Answer", "text": "Chronos is Kaevrix's study velocity and momentum engine. It calculates learning pace, estimates completion dates, tracks streaks, and automatically compiles your study history into downloadable PDF textbooks." } },
        { "@type": "Question", "name": "How does Kaevrix solve Tutorial Hell?", "acceptedAnswer": { "@type": "Answer", "text": "Kaevrix replaces passive video consumption with interactive branching skill trees, automated note generation, and mandatory active recall boss checkpoints to verify true retention." } },
        { "@type": "Question", "name": "What is Astrix Network?", "acceptedAnswer": { "@type": "Answer", "text": "Astrix Network is the technology organization behind Kaevrix, dedicated to building advanced, personalized study platforms and educational software." } },
        { "@type": "Question", "name": "What is a learning roadmap?", "acceptedAnswer": { "@type": "Answer", "text": "A learning roadmap is a custom-generated curriculum. Kaevrix builds a dynamic path of milestone nodes tailored specifically to your ultimate learning goal." } },
        { "@type": "Question", "name": "How are skill trees created?", "acceptedAnswer": { "@type": "Answer", "text": "Using semantic mapping, complex subjects are broken down into fundamental nodes. As you pass active recall tests, you visually unlock higher-tier skills." } },
        { "@type": "Question", "name": "How does active recall improve learning?", "acceptedAnswer": { "@type": "Answer", "text": "Active recall forces your brain to retrieve information from memory rather than passively re-reading it, drastically improving long-term knowledge retention." } },
        { "@type": "Question", "name": "How does mastery tracking work?", "acceptedAnswer": { "@type": "Answer", "text": "The system continuously evaluates your quiz performance and study consistency, assigning a measurable mastery level and cryptographic proof to every node on your skill tree." } }
      ]
    }
  ];

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
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
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
