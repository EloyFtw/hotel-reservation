/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignorar errores de ESLint durante la construcción
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignorar errores de TypeScript durante la construcción
  typescript: {
    ignoreBuildErrors: true,
  },
  // Desactivar la optimización de imágenes si es necesario
  images: {
    domains: ["hoteleria-core.onrender.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Configuración de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

module.exports = nextConfig
