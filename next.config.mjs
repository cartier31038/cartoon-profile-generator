/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        SD_API_URL: process.env.SD_API_URL
    }
};

export default nextConfig;
