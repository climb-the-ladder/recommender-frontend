/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050',
    NEXT_PUBLIC_AI_URL: process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:5001',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
};

export default nextConfig;
