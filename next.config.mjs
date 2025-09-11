/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { useWasmBinary: true },
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
