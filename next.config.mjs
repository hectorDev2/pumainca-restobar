/** @type {import('next').NextConfig} */
const nextConfig = {
  // Solo usar 'standalone' si se ejecuta dentro de Docker (detectar con variable)
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
};

export default nextConfig;
