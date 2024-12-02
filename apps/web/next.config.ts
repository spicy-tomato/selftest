import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@web': path.resolve(__dirname, '../../apps/web'),
      '~': __dirname,
    };
    return config;
  },
};

export default nextConfig;
