/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["cloudinary"],
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakeimg.pl",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/home",
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
