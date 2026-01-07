import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',       // generalmente vacío
        pathname: '/**', // permite cualquier ruta dentro de ese host
      },
    ],
  },
};

export default nextConfig;
