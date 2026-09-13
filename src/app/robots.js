export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai',
        ],
        allow: ['/', '/llms.txt', '/llms-full.txt'],
      },
    ],
    sitemap: 'https://astrixnetwork.com/sitemap.xml',
  };
}

