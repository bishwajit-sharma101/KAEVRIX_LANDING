export const metadata = {
  title: 'Terms of Service | Kaevrix',
  description: 'Terms of Service for Kaevrix, the AI Personalized Learning Platform.',
};

export default function TermsOfService() {
  return (
    <main style={{ padding: '160px 32px', maxWidth: '800px', margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>
      <h1 className="serif" style={{ fontSize: '48px', color: '#fff', marginBottom: '32px' }}>Terms of Service</h1>
      <p style={{ marginBottom: '16px' }}>Last updated: {new Date().toLocaleDateString()}</p>
      <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>Welcome to Kaevrix. By accessing or using our AI Personalized Learning Platform, you agree to be bound by these Terms of Service.</p>
      
      <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>1. Acceptance of Terms</h2>
      <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>By joining our waitlist or utilizing our services, you agree to comply with all applicable laws and regulations.</p>

      <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>2. Intellectual Property</h2>
      <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>All content, design, and systems on Kaevrix are the intellectual property of Astrix Network. You may not reproduce or distribute this content without permission.</p>

      <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>3. Disclaimer</h2>
      <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>Kaevrix is provided "as is" without warranties of any kind. We strive to provide the best educational roadmap, but outcomes depend on individual effort.</p>
    </main>
  );
}
