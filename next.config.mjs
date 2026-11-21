/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@electric-sql/pglite",
      "pg",
      "bcryptjs",
    ],
  },
  async redirects() {
    // The old placeholder "Turnamen" page now lives at the home page.
    return [{ source: "/tournaments", destination: "/", permanent: false }];
  },
};

export default nextConfig;
