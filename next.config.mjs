/** @type {import('next').NextConfig} */
console.log('[NextConfig] Environment Check:', {
  DOCKER_BUILD: process.env.DOCKER_BUILD,
  VERCEL: process.env.VERCEL,
  NODE_ENV: process.env.NODE_ENV,
});

const nextConfig = {
  // Solo usar 'standalone' si se ejecuta dentro de Docker y NO en Vercel
  ...(process.env.DOCKER_BUILD === 'true' && !process.env.VERCEL && { output: 'standalone' }),
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
