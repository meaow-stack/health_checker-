import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // experimental: {
  //   fontLoaders: [ // This is deprecated, next/font handles this automatically
  //     { loader: 'next/font/google', options: { subsets: ['latin'] } },
  //   ],
  // },
};

export default nextConfig;
