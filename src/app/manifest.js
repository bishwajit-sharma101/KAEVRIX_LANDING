export default function manifest() {
  return {
    name: 'Kaevrix — AI Learning App & Adaptive Study Platform',
    short_name: 'Kaevrix',
    description: 'Kaevrix by Astrix Network is the ultimate AI learning app and adaptive study platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0907',
    theme_color: '#E07A5F',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
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
  };
}
