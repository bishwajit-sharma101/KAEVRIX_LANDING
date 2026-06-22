import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Kaevrix',
  description: 'Terms of Service for Kaevrix, the AI Personalized Learning Platform.',
};

export default function TermsOfService() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', width: '100%' }}>
      <main style={{ padding: '100px 32px', maxWidth: '800px', margin: '0 auto', color: 'rgba(255,255,255,0.8)', fontFamily: "'Outfit', sans-serif" }}>
        <Link href="/" style={{ color: '#ff6a00', textDecoration: 'none', marginBottom: '40px', display: 'inline-block', letterSpacing: '2px', fontSize: '14px', textTransform: 'uppercase' }}>&larr; Back to Home</Link>

        <h1 style={{ fontSize: '48px', color: '#fff', marginBottom: '32px' }}>Terms of Service</h1>
        <p style={{ marginBottom: '16px', color: 'rgba(255,255,255,0.5)' }}>Last updated: {new Date().toLocaleDateString()}</p>
        <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>Welcome to Kaevrix. By accessing or using our AI Personalized Learning Platform, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not use our services.</p>
        
        <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>1. Acceptance of Terms</h2>
        <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>By joining our waitlist or utilizing our services, you agree to comply with all applicable laws and regulations.</p>

        <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>2. Intellectual Property</h2>
        <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>All content, design, and systems on Kaevrix are the intellectual property of Astrix Network. You may not reproduce, distribute, or create derivative works without explicit written permission.</p>

        <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>3. Disclaimer of Warranties (AS-IS)</h2>
        <p style={{ marginBottom: '24px', lineHeight: '1.6', textTransform: 'uppercase', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Kaevrix and all associated services are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the service will be uninterrupted, secure, or error-free.</p>

        <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>4. Limitation of Liability</h2>
        <p style={{ marginBottom: '24px', lineHeight: '1.6', textTransform: 'uppercase', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>In no event shall Kaevrix, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; and (iii) unauthorized access, use or alteration of your transmissions or content.</p>

        <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>5. Indemnification</h2>
        <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>You agree to defend, indemnify and hold harmless Kaevrix and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, or b) a breach of these Terms.</p>

        <h2 style={{ fontSize: '24px', color: '#ff6a00', margin: '32px 0 16px 0' }}>6. Contact</h2>
        <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>For any legal inquiries regarding these terms, contact us at: <a href="mailto:bishwajitsharma504@gmail.com" style={{ color: '#ff6a00', textDecoration: 'none' }}>bishwajitsharma504@gmail.com</a>.</p>
      </main>
    </div>
  );
}
