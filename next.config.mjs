/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
      experimental: {
        serverComponentsExternalPackages: [
          'puppeteer-core',
          '@sparticuz/chromium'
        ]
      }
};

export default nextConfig;
