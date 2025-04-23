/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable environment variables to be available to client-side
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
