/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home/Todos",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/home/Todos",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
