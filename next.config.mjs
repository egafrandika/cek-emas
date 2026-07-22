/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep Turso/libsql out of the Next webpack bundle (avoids broken SSR/hooks)
    serverComponentsExternalPackages: ["@libsql/client", "@libsql/hrana-client"],
  },
};

export default nextConfig;
