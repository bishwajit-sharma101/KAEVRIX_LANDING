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
  title: "Kaevrix | AI Powered Personalized Learning App by Astrix Network",
  description: "Kaevrix by Astrix Network is the ultimate AI learning app and personalized study tool. Transform your education with AI-generated roadmaps, interactive video learning, and community gathering spaces.",
  keywords: ["ai learning app", "personalized learning app", "ai study tool", "Astrix Network", "Kaevrix", "synchronized study", "education RPG", "AI powered learning app", "personalized study platform", "AI study tools", "Kaevrix learning", "Astrix"],
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
    title: "Kaevrix | AI Powered Personalized Learning App by Astrix Network",
    description: "Transform your education with AI-generated roadmaps and interactive video learning. Built by Astrix Network.",
    url: "https://astrixnetwork.com",
    siteName: "Kaevrix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaevrix | AI Powered Personalized Learning App",
    description: "Transform your education with AI-generated roadmaps and interactive video learning. Built by Astrix Network.",
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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
      "name": "Kaevrix | AI-Powered Personalized Learning App",
      "operatingSystem": "Web",
      "applicationCategory": "EducationalApplication",
      "description": "Kaevrix by Astrix Network is an AI powered learning app and personalized study platform that turns education into an RPG.",
      "url": "https://astrixnetwork.com"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What is Kaevrix?", "acceptedAnswer": { "@type": "Answer", "text": "Kaevrix is an adaptive learning platform by Astrix Network that transforms educational content into an interactive mastery journey using personalized skill trees and active recall." } },
        { "@type": "Question", "name": "What is Astrix Network?", "acceptedAnswer": { "@type": "Answer", "text": "Astrix Network is the parent technology company behind Kaevrix, dedicated to building advanced, personalized study platforms and educational software." } },
        { "@type": "Question", "name": "How does personalized learning work?", "acceptedAnswer": { "@type": "Answer", "text": "The platform analyzes your current knowledge base and automatically adapts quizzes, study materials, and pacing to perfectly match your cognitive needs." } },
        { "@type": "Question", "name": "What is a learning roadmap?", "acceptedAnswer": { "@type": "Answer", "text": "A learning roadmap is a custom-generated curriculum. Kaevrix builds a dynamic path of milestones tailored specifically to your ultimate learning goal." } },
        { "@type": "Question", "name": "How are skill trees created?", "acceptedAnswer": { "@type": "Answer", "text": "Using semantic mapping, complex subjects are broken down into fundamental nodes. As you pass active recall tests, you visually unlock higher-tier skills." } },
        { "@type": "Question", "name": "Is Kaevrix an AI study app?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Beyond curriculum generation, Kaevrix functions as a comprehensive study platform providing integrated tracking, notes, and automated assessments." } },
        { "@type": "Question", "name": "Can it create personalized study plans?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. You input your target skill and deadline, and the algorithm generates a daily study plan optimized for maximum knowledge retention." } },
        { "@type": "Question", "name": "What is an adaptive learning platform?", "acceptedAnswer": { "@type": "Answer", "text": "Adaptive learning means the system responds to you. If you struggle with a concept, the platform provides foundational material before letting you advance." } },
        { "@type": "Question", "name": "How does active recall improve learning?", "acceptedAnswer": { "@type": "Answer", "text": "Active recall forces your brain to retrieve information from memory rather than passively re-reading it, drastically improving long-term knowledge retention." } },
        { "@type": "Question", "name": "Is it built for competitive learning?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, our educational gamification systems allow users to engage in synchronized study sessions and track their mastery against peers." } },
        { "@type": "Question", "name": "Who is Kaevrix for?", "acceptedAnswer": { "@type": "Answer", "text": "It is built for autodidacts, students, and professionals who want a structured, mastery-based learning experience." } },
        { "@type": "Question", "name": "How does mastery tracking work?", "acceptedAnswer": { "@type": "Answer", "text": "The system continuously evaluates your quiz performance and study consistency, assigning a measurable mastery level to every node on your skill tree." } },
        { "@type": "Question", "name": "Are there career learning paths?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, our system can generate comprehensive roadmaps tailored to specific technical, academic, or creative careers." } },
        { "@type": "Question", "name": "How does it differ from traditional LMS?", "acceptedAnswer": { "@type": "Answer", "text": "Unlike a standard Learning Management System that hosts static videos, Kaevrix is an interactive study platform that actively tests and maps your brain's progression." } },
        { "@type": "Question", "name": "Does Astrix Network offer learning analytics?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, the platform provides deep analytics on your study habits, retention rates, and fastest-growing skill areas." } }
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
