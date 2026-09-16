/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '192.168.1.35',
    '192.168.1.35:3000',
    '192.168.1.34',
    '192.168.1.34:3000',
    '192.168.1.33',
    '192.168.1.33:3000',
    '192.168.1.36',
    '192.168.1.36:3000',
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
  ],
  devIndicators: false,
};

export default nextConfig;
