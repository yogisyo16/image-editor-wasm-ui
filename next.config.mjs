/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
		unoptimized: true,
	},
	experimental: {
		scrollRestoration: true,
	},
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;