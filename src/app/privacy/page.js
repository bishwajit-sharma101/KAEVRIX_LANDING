export const metadata = {
  title: 'Privacy Policy | Kaevrix',
  description: 'Privacy Policy for Kaevrix, the AI Personalized Learning Platform.',
};

export default function PrivacyPolicy() {
  return (
    <main style={{ padding: '160px 32px', maxWidth: '800px', margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>
      <h1 className="serif" style={{ fontSize: '48px', color: '#fff', marginBottom: '32px' }}>Privacy Policy</h1>
      <p style={{ marginBottom: '16px' }}>Last updated: {new Date().toLocaleDateString()}</p>
      <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>At Kaevrix, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your information when you use our AI Personalized Learning Platform.</p>
      
      <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>1. Information We Collect</h2>
      <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>We only collect information necessary to provide you with the best personalized learning experience. Currently, this includes your email address when you join our waitlist.</p>

      <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>2. How We Use Your Information</h2>
      <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>Your information is used exclusively to notify you about Kaevrix updates and early access opportunities. We do not sell your personal data to third parties.</p>

      <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>3. Contact Us</h2>
      <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>If you have any questions about this Privacy Policy, please contact us via Astrix Network.</p>
    </main>
  );
}
