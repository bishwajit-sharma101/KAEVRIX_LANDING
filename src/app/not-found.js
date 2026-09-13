import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found — Kaevrix',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-parchment, #F4F1DE)',
      color: 'var(--text-ink, #2D241F)',
      fontFamily: 'var(--font-display, system-ui)',
      textAlign: 'center',
      padding: '24px',
    }}>
      <h1 style={{
        fontSize: 'clamp(72px, 10vw, 120px)',
        fontWeight: 800,
        margin: 0,
        lineHeight: 1,
        color: 'var(--accent-terracotta, #E07A5F)',
        opacity: 0.85,
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: 'clamp(20px, 3vw, 32px)',
        fontWeight: 500,
        margin: '16px 0 8px',
        fontStyle: 'italic',
        fontFamily: 'var(--font-playfair, Georgia, serif)',
      }}>
        Page Not Found
      </h2>
      <p style={{
        fontSize: '16px',
        color: 'var(--text-muted, #8A8177)',
        maxWidth: '420px',
        lineHeight: 1.6,
        margin: '0 0 32px',
      }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 28px',
          background: 'var(--text-ink, #2D241F)',
          color: 'var(--bg-parchment, #F4F1DE)',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: 600,
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        &larr; Back to Home
      </Link>
    </div>
  );
}
