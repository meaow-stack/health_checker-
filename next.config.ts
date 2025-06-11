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
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/maps/api/place/photo/**',
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
