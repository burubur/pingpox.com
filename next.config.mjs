/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // The old placeholder "Turnamen" page now lives at the home page.
    return [{ source: "/tournaments", destination: "/", permanent: false }];
  },
};

export default nextConfig;
