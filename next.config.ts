import type { NextConfig } from "next";

// GitHub Actions passes NEXT_PUBLIC_BASE_PATH via actions/configure-pages output.
// For user/org pages (username.github.io) this will be empty string.
// For repo pages (username.github.io/lane-academy) this will be /lane-academy.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,

  images: {
    // Static export cannot use Next.js image optimisation endpoint.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/damr6r9op/**',
      },
    ],
  },
};

export default nextConfig;
