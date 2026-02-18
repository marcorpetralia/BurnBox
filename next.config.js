/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Disable image optimization if not using a CDN (Azure Web App default)
  images: {
    unoptimized: false,
  },
};

module.exports = nextConfig;
