/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Note: In Next.js 16, ESLint no longer runs during `next build` by default,
  // so there's no need for eslint.ignoreDuringBuilds. ESLint checks should be
  // run separately via `npm run lint`. This maintains consistency: TypeScript
  // errors are ignored during builds (via ignoreBuildErrors), and ESLint errors
  // don't affect builds (because ESLint doesn't run during builds).
};

export default nextConfig;