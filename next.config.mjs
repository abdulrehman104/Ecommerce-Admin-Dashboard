/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "umddsdgqlyrwbmlqgjzo.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
