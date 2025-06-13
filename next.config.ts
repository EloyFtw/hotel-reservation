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
}

module.exports = nextConfig
