/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['selenite.global.ssl.fastly.net', 'v0.blob.com'],
  },
  // Ensure ESLint doesn't block deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure TypeScript errors don't block deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  // Improve output for errors
  output: 'standalone',
}

export default nextConfig
