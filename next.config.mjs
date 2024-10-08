/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'replicate.delivery',
            },
            {
                protocol: 'https',
                hostname: 'xfzfyoyfufhhenrnbmkn.supabase.co',
            },
        ],
    },
};

export default nextConfig;
