const isGithubPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: isGithubPages ? '/rca-ops-team' : '',
    assetPrefix: isGithubPages ? '/rca-ops-team/' : '',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
