/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reikalinga self-host (Docker) variantui — sukuria minimalų standalone serverį
  output: "standalone",
  images: {
    // Sanity CDN nuotraukoms
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};
export default nextConfig;
