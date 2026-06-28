export default function manifest() {
  return {
    name: 'Kaevrix - AI Personalized Learning Platform',
    short_name: 'Kaevrix',
    description: 'Kaevrix by Astrix Network is the ultimate AI powered learning app and personalized study platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#ff6a00',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
