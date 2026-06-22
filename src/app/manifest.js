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
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
