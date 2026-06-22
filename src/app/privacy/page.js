import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Kaevrix',
  description: 'Privacy Policy for Kaevrix, the AI Personalized Learning Platform.',
};

export default function PrivacyPolicy() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', width: '100%' }}>
      <main style={{ padding: '100px 32px', maxWidth: '800px', margin: '0 auto', color: 'rgba(255,255,255,0.8)', fontFamily: "'Outfit', sans-serif" }}>
        <Link href="/" style={{ color: '#ff6a00', textDecoration: 'none', marginBottom: '40px', display: 'inline-block', letterSpacing: '2px', fontSize: '14px', textTransform: 'uppercase' }}>&larr; Back to Home</Link>
        
        <h1 style={{ fontSize: '48px', color: '#fff', marginBottom: '32px' }}>Privacy Policy</h1>
        <p style={{ marginBottom: '16px', color: 'rgba(255,255,255,0.5)' }}>Last updated: {new Date().toLocaleDateString()}</p>
        <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>At Kaevrix, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your information when you use our AI Personalized Learning Platform.</p>
        
        <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>1. Information We Collect</h2>
        <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>We only collect information necessary to provide you with the best personalized learning experience. Currently, this includes your email address when you join our waitlist.</p>

        <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>2. How We Use Your Information</h2>
        <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>Your information is used exclusively to notify you about Kaevrix updates and early access opportunities. We do not sell, rent, or lease your personal data to third parties.</p>

        <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>3. Data Security</h2>
        <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>We implement standard security measures to maintain the safety of your personal information. However, no transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

        <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>4. Contact Us</h2>
        <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:bishwajitsharma504@gmail.com" style={{ color: '#ff6a00', textDecoration: 'none' }}>bishwajitsharma504@gmail.com</a>.</p>
      </main>
    </div>
  );
}
