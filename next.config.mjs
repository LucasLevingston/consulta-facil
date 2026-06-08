/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
	async redirects() {
		return [
			{
				source: "/dashboard/schedule",
				destination: "/settings/schedule",
				permanent: true,
			},
			{
				source: "/dashboard/services",
				destination: "/settings/services",
				permanent: true,
			},
			{
				source: "/settings/billing/clinic",
				destination: "/settings/billing",
				permanent: true,
			},
			{
				source: "/auth/completar-cadastro",
				destination: "/auth/complete-profile",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
