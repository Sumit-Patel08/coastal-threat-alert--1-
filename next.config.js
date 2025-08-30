/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        // Fix for Windows OneDrive path issues
        '@': './src',
      },
    },
  },
  // Disable file system cache to avoid OneDrive sync issues
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Fix for Windows path handling
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/.next/**', '**/node_modules/**', '**/.git/**'],
      }
    }
    return config
  },
}

module.exports = nextConfig
