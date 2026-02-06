/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de imagen
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "bhzcukhjlmlvasumnwkg.supabase.co",
      },
    ],
    // Optimizar formatos de imagen
    formats: ["image/avif", "image/webp"],
  },
  
  // Compression
  compress: true,
};

export default nextConfig;
