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
};

export default nextConfig;